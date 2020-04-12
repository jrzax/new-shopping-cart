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
import { positions } from '@material-ui/system';

const useStyles = makeStyles({
  root: {
    justifyContent: 'center',
    height: 400
  },
  caa: {
    height: 350
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
});

const imgParser = (sku) => {
  const prefix = "data/products/";
  const suffix = "_1.jpg";
  return (prefix+sku+suffix);
}

const SimpleCardList = ({products}) => {
  return (
    <React.Fragment>
    <Grid container spacing={2} alignItems={"center"}>
        {products.map((item) => (
            <SimpleCard item={item}/>
        ))}
    </Grid>
    </React.Fragment>
  );
}

const SimpleCard = ({item}) => {
  const classes = useStyles();

  return (
    <Grid container item xs={4} justify={"center"} align-items-xs-center={true}>
    <Card className={classes.root}>
    <CardActionArea className={classes.caa}>
      <Typography className={classes.title} align="center">
        {item.title}
      </Typography>
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
        <Typography variant="body3" component="p">
         {item.description}
        </Typography>
      </CardContent>
      </CardActionArea>
      <CardActions>
      <ButtonGroup position="bottom" className={classes.bg}>
        <Button className={classes.pos}>S</Button>
        <Button className={classes.pos}>M</Button>
        <Button className={classes.pos}>L</Button>
        <Button className={classes.pos}>XL</Button>
      </ButtonGroup>
      </CardActions>
    </Card>
    </Grid>
  );
}

const App = () => {
  const [data, setData] = useState({});
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
    <Container maxWidth="sm">
    <SimpleCardList products = {products}></SimpleCardList>
    </Container>
  );
};

export default App;
