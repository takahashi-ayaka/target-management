import { any } from "prop-types";
import React, { useEffect, useReducer, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useForm } from "react-hook-form";
import TextControl from "../../components/form/TextControl";
import UserRegisterButtonControl from "./UserRegisterButtonControl";
import axios from "axios";
import { getErrorCondition, getErroMessage} from "../../common/error"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MenuButton from "../../components/MenuButton"

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
  id: undefined,
  login_id: undefined,
  password: undefined,
  user_name: undefined,
  authority: undefined,
  errors: {}
}

// user reducer
const reducer = (state, action) => {

  switch(action.type) {
    case "GET_USER":
      return {...state,
        id: action.payload.id,
        login_id: action.payload.login_id,
        password: action.payload.password,
        user_name: action.payload.user_name,
        authority: action.payload.authority,
        errors: {},
      };
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

const UserForm = (props) => {
  const {id} = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();
  const classes = useStyles();
  const [pageMode, setPageMode] = useState(props.pageMode);
  const readOnly = pageMode === "edit" ? false : true;
  const {control, handleSubmit, reset} = useForm({
    shouldUnregister: false
  });
  const [dummy, setDummy] = useState(false); // Material-UIのTextFieldリフレッシュ用useState

  // userデータ取得
  const getUserInfo = async () => {
    const url = `/api/users/${id}`;

    await axios.get(url).then(
      (response) => {
        const user = response.data.user;
        dispatch ({type: 'GET_USER', payload: user})
      }
    ).catch (
      (error) => {
        if (error.response.status === 404 ) {
          // 一旦アラート表示して検索画面に逃してしまう
          alert("該当ユーザが存在しないよ。。");
          history.push("/users");
        } else {
          // その他はサーバサイドエラーとしてしまう。
          history.push('/');
        }
      }
    )
  }

  // user 入力チェック
  const doConfirm = async (data) => {
    const url = `/api/users/${id}/confirm`;
    const userJSON = `{"user": ${JSON.stringify(data)}, "mode": "edit"}`

    await axios.post(url, JSON.parse(userJSON))
    .then(
      () => {
        // エラーをリフレッシュ
        dispatch ({type: 'CONFIRM', payload: {}})
        setPageMode("confirm");
      }
    ).catch(
      (error) => {
        if (error.response.status === 400) {
          const errors = error.response.data;
          dispatch ({type: 'CONFIRM', payload: errors})
        }
        else if (error.response.status === 404) {
          // 一旦アラート表示して検索画面に逃してしまう
          alert("該当ユーザが存在しないよ。");
          history.push("/users");
        } else {
          // その他はサーバサイドエラーとしてしまう。
          history.push('/');
        }
      }
    );
  }

  // user 登録更新
  const doPost = async (data) => {
    const url = `/api/users/${id}/update`;
    const userJSON = `{"user": ${JSON.stringify(data)}, "mode": "edit"}`

    axios.patch(url, JSON.parse(userJSON))
    .then(
      () => {
        alert("登録しました。");
        history.push("/users");
        // // 更新できたら詳細画面に飛ばす
        // history.push(`/users/${id}`);
        // setPageMode("show");
      }
      
    ).catch(
      (error) => {
        if (error.response.status === 400) {
          alert("登録できません。");
        }
      }
    );
  }

  useEffect(() => {
    console.log('**** useEffect ****');
    getUserInfo(id);
  }, []);

  useEffect(() => {
    console.log('**** useEffect(Error) ****');
    setDummy(false);
  }, [state.errors]);

  // Material-UIのTextFieldリフレッシュ用ダミー描画
  // エラーメッセージがあるときに詳細に戻るとラベルがShrinkしないため苦肉の策
  if (dummy){
    return <></>;
  }

  // 初期レンダリング時はデータが取れていないので
  // RHFの関係上、空レンダリングする
  if (state.id === undefined){
    return <></>;
  }

  return (
    <main>
      <h1 className={classes.title}><FontAwesomeIcon icon={faUser} color="#96d4d4" size="1x" /> ユーザー詳細</h1>
      <form onSubmit={handleSubmit(pageMode === "confirm" ? doPost : doConfirm)}>
        <div className={classes.container}>
          <div className={classes.list}>
            <span className={classes.label}>ユーザID</span>
            <TextControl
              control={control}
              name="id"
              label="ID"
              value={state.id}
              readOnly={true}
            />
          </div>
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
              type="password"
              error={getErrorCondition(state.errors, "password")}
              helperText={getErroMessage(state.errors, "password")}            
            />
          </div>
          <div className={classes.list}>
            <span className={classes.label}>権限</span>
            <TextControl
              control={control}
              name="authority"
              label="権限"
              value={state.authority}
              readOnly={true}
              error={getErrorCondition(state.errors, "authority")}
              helperText={getErroMessage(state.errors, "authority")}            
            />
          </div>
          <div className={classes.btn_submit}>
            <UserRegisterButtonControl
              id={id}
              pageMode={pageMode}
              useState={setPageMode}
              dispatch={dispatch}
              setDummy={setDummy}  // Material-UIのTextFieldリフレッシュ用useState
              reset={reset}
            />
          </div>
        </div>
        <div className={classes.bar_container}>
          <MenuButton />
        </div>
      </form>
    </main>
  );
}

// 何故かTSが邪魔しているので
UserForm.propTypes = {
  pageMode: any,
  location: any
}

export default React.memo(UserForm);
