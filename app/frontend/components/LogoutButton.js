import React from "react";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router";
import axios from "axios";
import Cookies from 'js-cookie';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    hedder__bar: {
      width: 140,
      marginLeft: 12,
      marginTop: 8
    }
  })
);

const LogoutButton = () => {
  const history = useHistory();
  const classes = useStyles();
  const url = "/api/logout";

  const doSignOut = async () => {
    await axios.get(url, {
      cache: "no-store",
      credentials: "include",
      headers:{"X-CSRF-TOKEN" : Cookies.get("csrf_access_token")},
    })
    .then(
      () => {
        // ログイン画面に遷移
        history.push('/');
      }
    ).catch(
      () => {
        // エラーになってもとりあえずログイン画面に遷移させる
        history.push('/');
      }
    );
  }  
  
  return (
    <Button
      type="button"
      variant="contained"
      color="secondary"
      className={classes.hedder__bar}
      onClick={() => doSignOut()}
    >
      ログアウト
    </Button>
  );
}

export default React.memo(LogoutButton);
