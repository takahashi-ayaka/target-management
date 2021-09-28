import React, { useState } from "react";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import { useForm, Controller } from "react-hook-form";
import { any } from "prop-types";
import axios from "axios";
import UsersList from "./UsersList";
import { useHistory } from "react-router";
import MenuButton from "../../components/MenuButton"
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      // display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    bar_container: {
      // display: 'flex',
      flexWrap: 'wrap',
      margin: `${theme.spacing(0)} auto`
    },
    search__bar: {
      width: 100,
      marginLeft: 12,
      marginTop: 8
    },
    menu__bar: {
      width: 100,
      marginLeft: 12,
      marginTop: 8
    },
    create__bar: {
      width: 100,
      marginLeft: 12,
      marginTop: 8
    },
    title: {
      padding: "0.25em 0.5em",
      color: "#797979",
      borderLeft: "solid 5px #ffaf58"
    },
    search__result: {
      color: "#797979",
      textAlign: 'center'
    }
  })
);

const Users = () => {
  const {control, handleSubmit} = useForm();
  const [usersResult, setUsersResult] = useState([]);
  const [searchResult, setSearchResult] = useState('検索してください');
  const history = useHistory();
  const classes = useStyles();

  const doSearch = async (data) => {
    
    const url = "/api/users";
    const searchJSON = `{"params": ${JSON.stringify(data)}}`
    
    await axios.get(url, JSON.parse(searchJSON))
    .then(
      (response) => {
        setUsersResult(response.data.users);
      }
    ).catch(
      (error) => {
        if (error.response.status === 404 ) {
          // エラーメッセージを取得
          setSearchResult('検索結果がありませんでした');
          setUsersResult([]);
        } else {
          // その他はサーバサイドエラーとしてしまう。
          history.push('/');
        }
      }
    );
  }

  // 検索項目などはいっぱいあったりするかもなので
  // formでまとめてやる(React Hook Form).usestate代わり
  return (
    <main>
      <h1 className={classes.title}><FontAwesomeIcon icon={faUser} color="#96d4d4" size="1x" /> ユーザ一覧</h1>
      <form onSubmit={handleSubmit(doSearch)}>
      <div className={classes.container}>
        <Controller
          name="userName"
          control={control}
          defaultValue=""
          render={
            function render ({ field:{ value, onChange } }) {
              return (
                <TextField
                  label="ユーザ名"
                  variant="outlined"
                  onChange={onChange}
                  value={value}
                />
              );             
            }
          }
        />
        <Button 
          type="submit"
          variant="contained" 
          color="primary"
          className={classes.search__bar}
        >
          検索<span style={{ marginLeft: "5%"}}><FontAwesomeIcon icon={faSearch} size="1x" /></span>
        </Button>
      </div>
      <div className={classes.bar_container}>
        <MenuButton />
        <Button 
          type="button"
          variant="contained" 
          color="secondary"
          className={classes.create__bar}
          onClick={() => { history.push("/users/new") }}
        >
          新規作成
        </Button>
      </div>
      </form>
      <br/>
      {
        usersResult.length === 0 ?
        <div className={classes.search__result}>{searchResult}</div>
        :
        <UsersList users={usersResult} />
      }
    </main>
  );
}
// 何故かTSが邪魔しているので
Users.propTypes = {
  field: any,
  fieldState: any
}

export default React.memo(Users);
