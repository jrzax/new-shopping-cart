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

const SimpleCardList = ({products,cart,setcart}) => {
  const handleClick = (num, price) => {
    let newCart = [...cart];
    if(cart.find(({sku}) => sku == num) != undefined) {
      newCart.forEach(function(item, i) { if (item.sku == num) newCart[i].count += 1; });
    } else {
      let obj ={
        "sku": num,
        "count": 1,
        "price": price
      };
      newCart.push(obj);
    }
    setcart(newCart);
  };
  return (
    <React.Fragment>
    <Box display="flex" flexDirection="row-reverse">
      <ShoppingCart cart={cart} style={{marginRight: "auto"}}></ShoppingCart>
    </Box>
    <Container maxWidth="sm">
    <Grid container spacing={2} alignItems={"center"}>
        {products.map((item,index) => (
            <SimpleCard item={item}
            key={item.sku}
            index={index}
            action={handleClick}
            />
        ))}
    </Grid>
    </Container>
    </React.Fragment>
  );
}

const SimpleCard = ({item,key,index,action}) => {
  const classes = useStyles();

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
      <ButtonGroup position="bottom" className={classes.bg} onClick={() => action(item.sku,item.price)}>
        <Button className={classes.pos}>S</Button>
        <Button className={classes.pos}>M</Button>
        <Button className={classes.pos}>L</Button>
        <Button className={classes.pos}>XL</Button>
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
  const [carty, setCart] = useState({});
  const cart = Object.values(carty)
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <Container >
        <SimpleCardList products = {products} cart={cart} setcart={setCart}></SimpleCardList>
    </Container>
  );
};

export default App;
