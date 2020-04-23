import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { Message } from 'rbx';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import ShoppingCart from './components/ShoppingCart';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import Box from '@material-ui/core/Box';
import firebase from './shared/firebase.js';
import 'firebase/database';

import { positions } from '@material-ui/system';

const db = firebase.database();

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const Banner = ({ user, title }) => (
  <React.Fragment>
    { user ? <Welcome user={ user } /> : <SignIn /> }
  </React.Fragment>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);

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

const SimpleCardList = ({products,cart,setcart, inventory, user}) => {
  const handleClick = (num, price, size) => {
    let newInventory = [...inventory];
    let bin = cart.filter(function(item)  {return item[0] == num.toString()})
    if (bin.length > 0){
      bin[0][1][size] += 1;
      let newbin = {};
      newbin[num.toString()] = bin[0][1];
      if(user != null) db.ref(`cart/${user.uid}`).update(newbin);
    } else {
      let o = {};
      let obj ={
          "S": 0,
          "M": 0,
          "L": 0,
          "XL": 0,
          "price": price
      };
      o[num.toString()] = obj;
      o[num.toString()][size] += 1;
      if(user != null) db.ref(`cart/${user.uid}`).update(o);
    }
  };
  const removeitem = (num) => {
    let newCart = [...cart];
    let newInventory = [...inventory]
    let found = cart.filter(function(item)  {return item[0] == num.toString()})
    newCart = newCart.filter(function(item) {return item[0] != num});
    setcart(newCart);
    if(user != null) db.ref(`cart/${user.uid}/${num}`).remove();
  };
  return (
    <React.Fragment>
    <Box display="flex" flexDirection="row-reverse">
      <ShoppingCart cart={cart} style={{marginRight: "auto"}} removeitem={removeitem} inventory={inventory} user ={user}></ShoppingCart>
    </Box>
    <Container maxWidth="sm">
    <Grid container spacing={2} alignItems={"center"}>
        {products.map((item,index) => (
            <SimpleCard item={item}
            num={item.sku.toString()}
            index={index}
            action={handleClick}
            inventory={inventory}
            cart={cart}
            />
        ))}
    </Grid>
    </Container>
    </React.Fragment>
  );
}

const SimpleCard = ({item, num, index,action, inventory, cart}) => {
  const classes = useStyles();
  const disabled = () => {
    let result = [true,true,true,true];
    let bin = cart.filter(function(x)  {return x[0] == num});
    if (Object.entries(inventory).length === 0 || inventory.find((elem) =>  elem.sku == num) == undefined) {
      return result;
    } else if (bin.length == 0) {
      if(inventory.find((elem) =>  elem.sku == num)["S"] > 0) {
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

    } else {
        if(inventory.find((elem) =>  elem.sku == num)["S"]-bin[0][1]["S"] > 0) {
          result[0] = false;
        }
        if(inventory.find((elem) =>  elem.sku == num)["M"]-bin[0][1]["M"] > 0){
          result[1] = false;
        }
        if(inventory.find((elem) =>  elem.sku == num)["L"]-bin[0][1]["L"] > 0){
          result[2] = false;
        }
        if(inventory.find((elem) =>  elem.sku == num)["XL"]-bin[0][1]["XL"] > 0){
          result[3] = false;
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
  const cart = Object.entries(cartdata);
  const products = Object.values(data);
  const [user, setUser] = useState(null);
  const processInventory = (json) => {
    const keys = Object.keys(json);
    const values = Object.values(json);
    let newvals = [...values];
    for (let i = 0; i < newvals.length; i += 1)  {
      newvals[i].sku = keys[i]
    }
    setInventory(newvals);
  };
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const productjson = await response.json();
      setData(productjson);
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) processInventory(snap.val());
    }
    db.ref(`inventory`).on('value', handleData, error => alert(error));
    return () => { db.ref(`inventory`).off('value', handleData); };
  }, []);

  useEffect(() => {
   firebase.auth().onAuthStateChanged(setUser);
  }, []);
  useEffect(() => {
    const handleCart = snap => {
      if (snap.val()){
        setCart(snap.val());
      } else {
        setCart({});
      }
    }
    if (user != null) {
      db.ref(`cart/${user.uid}`).on('value', handleCart, error => alert(error));
      return () => { db.ref(`cart/${user.uid}`).off('value', handleCart); };
    } else {
      return
    }
  }, [user]);
  return (
    <Container >
      <Banner user={ user }/>
      <SimpleCardList products = {products} cart={cart} setcart={setCart} inventory={inventory} setinventory={setInventory} user={user}></SimpleCardList>
    </Container>
  );
};

export default App;
