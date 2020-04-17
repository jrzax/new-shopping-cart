import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import ShoppingCart from './components/ShoppingCart';
import Box from '@material-ui/core/Box';

import { positions } from '@material-ui/system';

const useStyles = makeStyles((theme) =>({
  root: {
    justifyContent: 'center'
  },
  ca: {
    textAlign: "center"
  },
  caa: {
  },
  di: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  media: {
    height: 240
  },
  bg: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    height: 40
  },
  pos: {
    maxWidth: '5px',
    minWidth: '5px',
    fontSize: 10
  },
  img: {
    height: 200
  }
}));


const imgParser = (sku) => {
  const prefix = "data/products/";
  const suffix = "_1.jpg";
  return (prefix+sku+suffix);
}

const SimpleCardList = ({products,cart,setcart, inventory, setinventory}) => {
  const handleClick = (num, price, size) => {
    let newCart = [...cart];
    let newInventory = [...inventory];
    console.log(size);
    if(cart.find(({sku}) => sku == num) != undefined) {
      newCart.forEach(function(item, i) { if (item.sku == num) newCart[i][size] += 1; });
      newInventory.forEach(function(item, i) { if (item.sku == num) newInventory[i][size] -= 1; });
    } else {
      let obj ={
        "sku": num,
        "S": 0,
        "M": 0,
        "L": 0,
        "XL": 0,
        "price": price
      };
      obj[size] += 1;
      newCart.push(obj);
      newInventory.forEach(function(item, i) { if (item.sku == num) newInventory[i][size] -= 1; });
    }
    setcart(newCart);
    setinventory(newInventory);
    console.log(newInventory);
  };
  const removeitem = (num) => {
    let newCart = [...cart];
    let newInventory = [...inventory]
    let found = newCart.find((item) => item.sku == num);
    newCart = newCart.filter(function(item) {return item.sku != num});
    newInventory.forEach(function(item, i) { if (item.sku == num){
      newInventory[i]["S"] = found["S"];
      newInventory[i]["M"] = found["M"];
      newInventory[i]["L"] = found["L"];
      newInventory[i]["XL"] = found["XL"];}});
    setinventory(newInventory);
    setcart(newCart);
  };
  return (
    <React.Fragment>
    <Box display="flex" flexDirection="row-reverse">
      <ShoppingCart cart={cart} style={{marginRight: "auto"}} removeitem={removeitem}></ShoppingCart>
    </Box>
    <Container maxWidth="sm">
    <Grid container spacing={2} alignItems={"center"}>
        {products.map((item,index) => (
            <SimpleCard item={item}
            num={item.sku}
            index={index}
            action={handleClick}
            inventory={inventory}
            setinventory={setinventory}
            />
        ))}
    </Grid>
    </Container>
    </React.Fragment>
  );
}

const SimpleCard = ({item, num, index,action, inventory, setinventory}) => {
  const classes = useStyles();
  const disabled = () => {
    let result = [true,true,true,true];
    if (Object.entries(inventory).length === 0) {
      return result
    } else {
        if(inventory.find((elem) =>  elem.sku == num) != undefined) {
          if(inventory.find((elem) =>  elem.sku == num)["S"] > 0){
            result[0] = false;
          }
          if(inventory.find((elem) =>  elem.sku == num)["M"] > 0){
            result[1] = false;
          }
          if(inventory.find((elem) =>  elem.sku == num)["L"] > 0){
            result[2] = false;
          }
          if(inventory.find((elem) =>  elem.sku == num)["XL"] > 0){
            result[3] = false;
          }
        }
      }
    return result;
  };
  const disable = disabled();

  return (
    <Grid container item xs={4} justify={"center"}>
    <Card className={classes.root}>
    <CardActionArea className={classes.caa}>
      <Box>
      <Typography className={classes.title} align="center">
        {item.title}
      </Typography>
      </Box>
      <CardMedia
        component = "img"
        className={classes.media}
        image = {imgParser(item.sku)}
        title ={item.sku}
      />
      <CardContent>
        <Typography variant="body2" component="p">
         ${item.price}
        </Typography>
        <Typography variant="caption" component="p">
         {item.description}
        </Typography>
      </CardContent>
      </CardActionArea>
      <CardActions className={classes.ca}>
      <div className={classes.di}>
      <ButtonGroup position="bottom" className={classes.bg}>
        <Button className={classes.pos} onClick={() => action(item.sku,item.price,"S")} disabled = {disable[0]}>S</Button>
        <Button className={classes.pos} onClick={() => action(item.sku,item.price,"M")} disabled = {disable[1]}>M</Button>
        <Button className={classes.pos} onClick={() => action(item.sku,item.price,"L")} disabled = {disable[2]}>L</Button>
        <Button className={classes.pos} onClick={() => action(item.sku,item.price,"XL")} disabled = {disable[3]}>XL</Button>
      </ButtonGroup>
      </div>
      </CardActions>
    </Card>
    </Grid>
  );
}


const App = () => {
  const classes = useStyles();
  const [data, setData] = useState({});
  const [inventory, setInventory] = useState({});
  const [cartdata, setCart] = useState({});
  const cart = Object.values(cartdata)
  const products = Object.values(data);
  const processInventory = (json) => {
    const keys = Object.keys(json);
    const values = Object.values(json);
    let newvals = [...values];
    for (let i = 0; i < newvals.length; i += 1)  {
      newvals[i].sku = keys[i]
    }
    setInventory(newvals);
    console.log([...newvals])
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const productjson = await response.json();
      setData(productjson);
    };
    fetchProducts();
    const fetchinventory = async ()  => {
      const response = await fetch('./data/inventory.json');
      const inventoryjson = await response.json();
      processInventory(inventoryjson)
    };
    fetchinventory();
  }, []);


  return (
    <Container >
        <SimpleCardList products = {products} cart={cart} setcart={setCart} inventory={inventory} setinventory={setInventory}></SimpleCardList>
    </Container>
  );
};

export default App;
