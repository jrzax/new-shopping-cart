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


const useStyles = makeStyles((theme) =>({
  root: {
    justifyContent: 'center',
    marginRight: '10px',
    marginLeft: '10px',
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
  }
}));

const imgParser = (sku) => {
  const prefix = "data/products//";
  const suffix = "_2.jpg";
  return (prefix+sku+suffix);
}

const SmallCardsList = ({cart, setcart}) => {
  return (
    <React.Fragment>
    <Grid container spacing={0} alignItems={"center"}>
        {cart.map((item) => (
            <SmallCard item={item}
            key={item.sku}/>
        ))}
    </Grid>
    <Typography>
    Total
    <p>${cart.reduce((a,b) => a + (b['count']*b['price'] || 0), 0)}</p>
    </Typography>
    </React.Fragment>
  );
}

const SmallCard = ({item, key, index}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
    <CardActionArea className={classes.caa}>
      <CardMedia
        component = "img"
        className={classes.media}
        image = {imgParser(item.sku)}
        title ={item.sku}
      />
    </CardActionArea>
    <p>{item.count}</p>
    </Card>
  );
}

export default SmallCardsList;
