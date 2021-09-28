import React from "react";
import { useHistory } from "react-router";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(() =>
  createStyles({
    menu__bar: {
      width: 140,
      marginLeft: 12,
      marginTop: 8
    }
  })
);

const MenuButton = () => {
  const history = useHistory();
  const classes = useStyles();
  return (
    <Button
      type="button"
      variant="contained"
      color="primary"
      className={classes.menu__bar}
      onClick={() => {
        history.push("/menu");
      }}
    >
      メニューに戻る
    </Button>
    
  );
}

export default React.memo(MenuButton);
