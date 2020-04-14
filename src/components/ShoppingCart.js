import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SmallCardsList from './SmallCardsList';

const useStyles = makeStyles({
  list: {
    width: 120,
  },
  fullList: {
    width: 'auto',
  },
});

export default function ShoppingCart({cart, style, removeitem}) {
  const classes = useStyles();
  const [state, setState] = React.useState(true);

  const toggleDrawer = (state, open) => (event) => {
    setState(open);

  };

  const list = (state) => (
    <div
      className={clsx(classes.list
      )}
      role="presentation"
      onClick={toggleDrawer(state, false)}
      onKeyDown={toggleDrawer(state, false)}
    >
    <Button onClick={toggleDrawer(state,false)}>Close</Button>
    <SmallCardsList cart={cart} removeitem={removeitem}></SmallCardsList>
    </div>
  );

  return (
    <div>
        <React.Fragment key={state}>
          <Button onClick={toggleDrawer(state, true)}>{'cart'}</Button>
          <Drawer anchor={'right'} open={state} onClose={toggleDrawer(state, false)}>
            {list(state)}
          </Drawer>
        </React.Fragment>
    </div>
  );
}
