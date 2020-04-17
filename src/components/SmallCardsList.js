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

const SmallCardsList = ({cart, setcart, removeitem}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
    <Grid container spacing={0} alignItems={"center"}>
        {cart.map((item) => (
            <SmallCard item={item}
            sku={item.sku}
            removeitem={removeitem}/>
        ))}
    </Grid>
    <Typography className={classes.rightside}>
    Total
    <p>${cart.reduce((a,b) => a + (b['S']*b['price']+b['M']*b['price']+b['L']*b['price']+b['XL']*b['price'] || 0), 0)}</p>
    </Typography>
    </React.Fragment>
  );
}

const SmallCard = ({item, sku, index, removeitem}) => {
  const classes = useStyles();

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
    <Grid container spacing={3}>
       <Grid container item xs>
          <Typography variant="body2" className={classes.leftside}>
          S: {item["S"]}
          </Typography>
       </Grid>
       <Grid container item xs>
          <Typography variant="body2" className={classes.rightside}>
          M: {item["M"]}
          </Typography>
       </Grid>
    </Grid>
    <Grid container spacing={3}>
      <Grid container item xs>
          <Typography variant="body2" className={classes.leftside}>
          L: {item["L"]}
          </Typography>
      </Grid>
      <Grid container item xs>
          <Typography variant="body2" className={classes.rightside}>
          XL: {item["XL"]}
          </Typography>
      </Grid>
     </Grid>
     <Button onClick={() => removeitem(sku)}>Remove</Button>
    </Card>
  );
}

export default SmallCardsList;
