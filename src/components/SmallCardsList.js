import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import 'typeface-roboto';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';

import firebase from '../shared/firebase.js';
import 'firebase/database';

const db = firebase.database();

const useStyles = makeStyles((theme) =>({
  root: {
    justifyContent: 'center',
    marginRight: '10px',
    marginLeft: '10px',
  },
  ca: {
    textAlign: "center"
  },
  p: {
    fontSize: "8px",
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
  },
  bg: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
  },
  pos: {
    maxWidth: '5px',
    minWidth: '5px',
    fontSize: 10
  },
  img: {
  },
  leftside: {
    marginLeft: '3px'
  },
  rightide: {
    marginRight: '3px'
  }
}));

const imgParser = (sku) => {
  const prefix = "data/products//";
  const suffix = "_2.jpg";
  return (prefix+sku+suffix);
}

const revertinv = (inventory) => {
  let result = {}
  const pullsku = (elem) => {
    let sku = elem.sku
    delete elem.sku
    result[sku] = elem
  }
  inventory.forEach(element => pullsku(element))
  return result
}

const SmallCardsList = ({cart, setcart, removeitem, inventory, user}) => {
  const classes = useStyles();
  const [flag, setFlag] = useState([false, []]);
  const updateItems = () => {
    for (let num of flag[1]) {
      let found = cart.filter(function(item)  {return item[0] == num})
      let newbin = {};
      newbin[num] = found[0][1];
      let invitem = inventory.find((elem) => elem.sku == num);
      if(invitem["S"]-found[0][1]["S"] < 0) {
        newbin[num]["S"] = invitem["S"];
      }
      if(invitem["M"]-found[0][1]["M"] < 0){
        newbin[num]["M"] = invitem["M"];
      }
      if(invitem["L"]-found[0][1]["L"] < 0){
        newbin[num]["L"] = invitem["L"];
      }
      if(invitem["XL"]-found[0][1]["XL"] < 0){
        newbin[num]["XL"] = invitem["XL"];
      }
      if(user != null) db.ref(`cart/${user.uid}`).update(newbin);
    }
    }
  const checkout = () => {
    let newinv = [...inventory]
    const updateinv = (element) => {
      const newinvitem = newinv.find(x => x.sku.toString() == element[0]);
      newinv = newinv.filter(x => x.sku.toString() != element[0]);
      newinvitem["S"] -= element[1]["S"];
      newinvitem["M"] -= element[1]["M"]
      newinvitem["L"] -= element[1]["L"]
      newinvitem["XL"] -= element[1]["XL"]
      newinv.push(newinvitem)
    }
    console.log(newinv)
    cart.forEach(element => updateinv(element))
    console.log(newinv)
    if(user != null) db.ref(`cart/${user.uid}`).set({});
    const dbinv = revertinv(newinv)
    console.log(dbinv)
    db.ref(`inventory`).set(dbinv);
  };
  return (
    <React.Fragment>
    <Grid container spacing={0} alignItems={"center"}>
        {Object.values(cart).map((item) => (
            <SmallCard item={item[1]}
            sku={item[0]}
            removeitem={removeitem}
            inventory={inventory}
            flag={flag}
            setflag={setFlag}/>
        ))}
    </Grid>
    <Typography className={classes.rightside}>
    Total
    <p>${Object.values(cart).reduce((a,b) => a + (b[1]['S']*b[1]['price']+b[1]['M']*b[1]['price']+b[1]['L']*b[1]['price']+b[1]['XL']*b[1]['price'] || 0), 0)}</p>
    </Typography>
      { flag[0] ? <Button onClick={() => updateItems()}>Update Cart </Button> : <Button onClick={() => checkout()}>Checkout</Button> }
    </React.Fragment>
  );
}

const SmallCard = ({item, sku, index, removeitem, inventory, flag, setflag}) => {
  const classes = useStyles();

  const disabled = () => {
    let dflag = false
    let result = [true,true,true,true];
    if (Object.entries(inventory).length === 0) {
      return result
    } else {
        if(inventory.find((elem) =>  elem.sku == sku) != undefined) {
          if(inventory.find((elem) =>  elem.sku == sku)["S"]-item["S"] < 0) {
            result[0] = false;
            dflag = true;
          }
          if(inventory.find((elem) =>  elem.sku == sku)["M"]-item["M"] < 0){
            result[1] = false;
            dflag = true;
          }
          if(inventory.find((elem) =>  elem.sku == sku)["L"]-item["L"] < 0){
            result[2] = false;
            dflag = true;
          }
          if(inventory.find((elem) =>  elem.sku == sku)["XL"]-item["XL"] < 0){
            result[3] = false;
            dflag = true;
          }
        }
      }
    if (dflag){
      if (flag[1].length == 0) {
        const newflag = [true, [sku]]
        setflag(newflag)
      } else if (flag[1].find((x) => x == sku) == undefined) {
        const newflag = [true, ...flag[1]]
        newflag[1].push(sku)
        setflag(newflag)
      }
    }
    return result;
  };

  const result = disabled();
  return (
    <Card className={classes.root}>
    <CardActionArea className={classes.caa}>
      <CardMedia
        component = "img"
        className={classes.media}
        image = {imgParser(sku)}
        title ={sku}
      />
    </CardActionArea>
    <Grid container spacing={0}>
       <Grid container item xs>
          { result[0] ?
            <Typography variant="body2" className={classes.leftside}> S: {item["S"]}  </Typography> :
             <Typography variant="caption" className={classes.leftside}> {"out of stock!"}  </Typography>}
       </Grid>
       <Grid container item xs>
       { result[1] ?
         <Typography variant="body2" className={classes.leftside}> M: {item["M"]}  </Typography> :
          <Typography variant="caption" className={classes.leftside}> {"out of stock!"}  </Typography>}
       </Grid>
    </Grid>
    <Grid container spacing={0}>
      <Grid container item xs>
      { result[2] ?
        <Typography variant="body2" className={classes.leftside}> L: {item["L"]}  </Typography> :
         <Typography variant="caption" className={classes.leftside}> {"out of stock!"}  </Typography>}
      </Grid>
      <Grid container item xs>
      { result[3] ?
        <Typography variant="body2" className={classes.leftside}> XL: {item["XL"]}  </Typography> :
         <Typography variant="caption" className={classes.leftside}> {"out of stock!"}  </Typography>}
      </Grid>
     </Grid>
     <Button onClick={() => removeitem(sku.toString())}>Remove</Button>
    </Card>
  );
}

export default SmallCardsList;
