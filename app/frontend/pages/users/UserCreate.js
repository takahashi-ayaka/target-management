import { any } from "prop-types";
import React, { useReducer, useState } from "react";
import { useHistory } from "react-router";
import { useForm, Controller } from "react-hook-form";
import TextControl from "../../components/form/TextControl";
import axios from "axios";
import {getErrorCondition, getErroMessage} from "../../common/error"
import Button from "@material-ui/core/Button";

import { InputLabel, FormControl, FormHelperText, Select, MenuItem } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { createStyles, makeStyles } from '@material-ui/core/styles';

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
      marginLeft: 12,
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
    list: {
      marginBottom: 10
    },
    label: {
      display: "inline-block",
      width: 115,
      lineHeight: "45px"
    },
    search__result: {
      color: "#797979",
      textAlign: 'center'
    },
    btn_submit: {
      textAlign: 'center',
      flexWrap: 'wrap',
      margin: `${theme.spacing(0)} auto`,
      marginTop: 18
    }
  })
);

// user initialState
const initialState = {
  login_id: "",
  password: "",
  user_name: "",
  authority: "",
  errors: {}
}

const reducer = (state, action) => {
  console.log(action);
  switch(action.type) {
    case "CONFIRM":
      return {...state,
        errors: action.payload,
      };
    case "ERROR_CLEAR":
      return {...state,
        errors: {},
      };
  }
  return state;
}

const UserCreate = (props) => {
  const {control, handleSubmit} = useForm();
  const [state, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();
  const [pageMode, setPageMode] = useState(props.pageMode);
  const readOnly = pageMode !== "confirm" ? false : true;
  const classes = useStyles();

  // user 入力チェック
  const doConfirm = async (data) => {
    const url = `/api/users/createConfirm`;
    const userJSON = `{"user": ${JSON.stringify(data)}, "mode": "edit"}`
    console.log(JSON.stringify(data));
    await axios.post(url, JSON.parse(userJSON))
    .then(
      () => {
        dispatch({type: 'ERROR_CLEAR'})
        setPageMode("confirm");
      }
    ).catch(
      (error) => {
        if (error.response.status === 400) {
          const errors = error.response.data;

          console.log(errors);
          dispatch({type: 'CONFIRM', payload: errors})
        }
        else if (error.response.status === 404) {
          alert("該当ユーザが存在しないよ!");
          history.push("/users/new");
        } else {
          history.push('/');
        }
      }
    );
  }

  // user 登録更新
  const doPost = async (data) => {
    const url = `/api/users/create`;
    const userJSON = `{"user": ${JSON.stringify(data)}, "mode": "edit"}`

    await axios.post(url, JSON.parse(userJSON))
    .then(
      () => {
        alert("登録しました。");
        history.push("/users");
      }
    ).catch(
      (error) => {
        if (error.response.status === 400) {
          alert("登録できません。");
        }
      }
    );
  }

  const backButton = (
  <Button 
      type="button"
      variant="contained" 
      color="primary"
      onClick={() => { 
        setPageMode("edit");
        history.push("/users/new/edit");
      }}
    >戻る</Button>
  );

  const searchButton = (
    <Button 
        type="button"
        variant="contained" 
        color="primary"
        onClick={() => { 
          setPageMode("edit");
          history.push("/users");
        }}
      >検索に戻る</Button>
    );

  const adminSelect = (
    <FormControl
      error={getErrorCondition(state.errors, "authority")}
      style={{minWidth:150}}
    >        
      <InputLabel id="demo-simple-select-label">権限</InputLabel>
      <Controller
        render={
          // eslint-disable-next-line react/display-name
          ({ field }) => <Select {...field}>
            <MenuItem value={""}>　</MenuItem>
            <MenuItem value={"administrator"}>administrator</MenuItem>
            <MenuItem value={"member"}>member</MenuItem>
          </Select>
        }
        control={control}
        name="authority"
        defaultValue={state.authority}
      />
      <FormHelperText>{getErroMessage(state.errors, "authority")}</FormHelperText>
    </FormControl>
  );

  const adminText = (
    <TextControl
      control={control}
      name="authority"
      label="権限"
      value={state.authority}
      readOnly={true}
      error={getErrorCondition(state.errors, "authority")}
      helperText={getErroMessage(state.errors, "authority")}            
    />
  );

  return (
    <main>
      <h1 className={classes.title}><FontAwesomeIcon icon={faUser} color="#96d4d4" size="1x" /> ユーザー新規登録</h1>
      <form onSubmit={handleSubmit(pageMode === "confirm" ? doPost : doConfirm)}>
        <div className={classes.container}>
          <div className={classes.list}>
            <span className={classes.label}>ユーザ名</span>
            <TextControl
              control={control}
              name="user_name"
              label="ユーザ名"
              value={state.user_name}
              readOnly={readOnly}
              error={getErrorCondition(state.errors, "user_name")}
              helperText={getErroMessage(state.errors, "user_name")}            
            />
          </div>
          <div className={classes.list}>
            <span className={classes.label}>ログインID</span>
            <TextControl
              control={control}
              name="login_id"
              label="ログインID"
              value={state.login_id}
              readOnly={readOnly}
              error={getErrorCondition(state.errors, "login_id")}
              helperText={getErroMessage(state.errors, "login_id")}            
            />
          </div>
          <div className={classes.list}>
            <span className={classes.label}>パスワード</span>
            <TextControl
              control={control}
              name="password"
              label="パスワード"
              value={state.password}
              readOnly={readOnly}
              error={getErrorCondition(state.errors, "password")}
              helperText={getErroMessage(state.errors, "password")}            
            />
          </div>
          <div className={classes.list}>
            <span className={classes.label}>権限</span>
            {pageMode === "confirm" ? adminText : adminSelect}
          </div>
        </div>
        <div className={classes.btn_submit}>
          {pageMode === "confirm" ? backButton : ""}
          <Button 
            type="submit"
            variant="contained" 
            color={pageMode === "confirm" ? "secondary" : "primary"}
          >
          {pageMode === "confirm" ? "登録" : "確認"}
          </Button>
        </div>
        <div className={classes.bar_container}>
        {pageMode === "confirm" ? "" : searchButton}
        </div>
      </form>
    </main>
  );
}

// 何故かTSが邪魔しているので
UserCreate.propTypes = {
  pageMode: any,
  location: any,
  field: any
}

export default React.memo(UserCreate);