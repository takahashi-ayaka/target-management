import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) =>
  createStyles({
    main: {
      margin: theme.spacing(15)
    },
    root: {
      textAlign: 'center',
      background: '#ffffe0'
    },
    link: {
      textDecoration: 'none'
    }
  })
);

const Menu = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  // React側でもログイン状態かチェック
  // 管理者は別メニューが出るようにする
  const menuAuthCheck = async () => {
    const url = "/api/menu_auth"

    await axios.get(url)
    .then(
      (response) => {
        setIsAdmin(response.data.admin);
      }
    ).catch(
      () => {
        // 状態チェックでエラーになった場合も一旦ログイン画面へ
        history.push("/");
      }
    )
  }

  // ランディング(最初の描画時のみ)実施
  useEffect(() => {
    menuAuthCheck();
  },[]);

  return (
    <main>
      <div className={classes.main}>
      <Grid container>
      <Grid item xs={4}>
        <Card className={classes.root}>
          <CardActionArea>
            <Link to="/items" className={classes.link}>
              <FontAwesomeIcon icon={faShoppingBag} color="#9696d4" size="6x" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                アイテム
            </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                アイテムの一覧を表示します
            </Typography>
            </CardContent>
            </Link>
          </CardActionArea>
        </Card>
        </Grid>
        {
          isAdmin ? 
          <Grid item xs={4}>
          <Card className={classes.root}>
            <CardActionArea>
              <Link to="/users" className={classes.link}>
                <FontAwesomeIcon icon={faUser} color="#96d4d4" size="6x" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  ユーザ
              </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  ユーザの一覧を表示します
              </Typography>
              </CardContent>
              </Link>
            </CardActionArea>
          </Card>
          </Grid>
          :
          <></>
        }
        <Grid item xs={4}>
        <Card className={classes.root}>
          <CardActionArea>
            <Link to="/car" className={classes.link}>
              <FontAwesomeIcon icon={faSearch} color="#a1d496" size="6x" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                車両検索
            </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                車両の検索、詳細を表示します。
            </Typography>
            </CardContent>
            </Link>
          </CardActionArea>
        </Card>
        </Grid>
        {
          isAdmin ? 
          <Grid item xs={4}>
          <Card className={classes.root}>
            <CardActionArea>
              <Link to="/carCreate" className={classes.link}>
                <FontAwesomeIcon icon={faCar} color="#d4b596" size="6x" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  車両登録
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  車両を登録します
                </Typography>
              </CardContent>
              </Link>
            </CardActionArea>
          </Card>
          </Grid>
          :
          <></>
        }
        <Grid item xs={4}>
          <Card className={classes.root}>
            <CardActionArea>
              <Link to="/" className={classes.link}>
                <FontAwesomeIcon icon={faSignInAlt} color="#bf96d4" size="6x" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  ログアウト
              </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  ログイン画面に戻ります
              </Typography>
              </CardContent>
              </Link>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
      </div>
    </main>
  );
}

export default Menu;
