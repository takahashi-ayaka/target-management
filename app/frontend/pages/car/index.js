import { any } from "prop-types";
import React, { useReducer, useState } from "react";
import { useHistory } from "react-router";
import { useForm, Controller } from "react-hook-form";
import TextControl from "../../components/form/TextControl";
import axios from "axios";
import {getErrorCondition, getErroMessage} from "../../common/error"
import Button from "@material-ui/core/Button";
import MenuButton from "../../components/MenuButton"
import Checkbox from '@material-ui/core/Checkbox';

import { InputLabel, FormControl, FormHelperText, Select, MenuItem } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
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
    btn_submit: {
      textAlign: 'center',
      flexWrap: 'wrap',
      margin: `${theme.spacing(0)} auto`,
      marginTop: 18
    }
  })
);

// car initialState
const initialState = {
  maker: "",
  model: "",
  grade: "",
  bodyColor: "",
  price: "",
  navi: "",
  kawa: "",
  sr: "",
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


const CarCreate = (props) => {
  const {control, handleSubmit} = useForm();
  const [state, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();
  const [pageMode, setPageMode] = useState(props.pageMode);
  const readOnly = pageMode !== "confirm" ? false : true;
  const check_disabled = pageMode !== "confirm" ? false : true;
  const classes = useStyles();

  // car 入力チェック
  const doConfirm = async (data) => {
    const url = `/api/carCreate/createConfirm`;
    const carJSON = `{"car": ${JSON.stringify(data)}, "mode": "edit"}`
    console.log(JSON.stringify(data));
    await axios.post(url, JSON.parse(carJSON))
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
          alert("エラーが発生しました。");
          history.push("/carCreate/new");
        } else {
          history.push('/');
        }
      }
    );
  }

  // car 登録更新
  const doPost = async (data) => {
    const url = `/api/carCreate/create`;
    const carJSON = `{"car": ${JSON.stringify(data)}, "mode": "edit"}`

    await axios.post(url, JSON.parse(carJSON))
    .then(
      () => {
        history.push("/carCreate/complete");
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
        history.push("/carCreate");
      }}
    >入力に戻る</Button>
  );

  const makerSelect = (
    <FormControl
      error={getErrorCondition(state.errors, "maker")}
      style={{minWidth:150}}
    >        
      <InputLabel id="demo-simple-select-label">メーカー名</InputLabel>
      <Controller
        render={
          // eslint-disable-next-line react/display-name
          ({ field }) => <Select {...field}>
            <MenuItem value={""}>　</MenuItem>
            <MenuItem value={"トヨタ"}>トヨタ</MenuItem>
            <MenuItem value={"日産"}>日産</MenuItem>
            <MenuItem value={"ホンダ"}>ホンダ</MenuItem>
            <MenuItem value={"三菱"}>三菱</MenuItem>
            <MenuItem value={"マツダ"}>マツダ</MenuItem>
            <MenuItem value={"スバル"}>スバル</MenuItem>
            <MenuItem value={"スズキ"}>スズキ</MenuItem>
            <MenuItem value={"ダイハツ"}>ダイハツ</MenuItem>
          </Select>
        }
        control={control}
        name="maker"
        defaultValue={state.maker}
      />
      <FormHelperText>{getErroMessage(state.errors, "maker")}</FormHelperText>
    </FormControl>
  );

  const makerText = (
    <TextControl
      control={control}
      name="maker"
      label="メーカー名"
      value={state.maker}
      readOnly={true}
      error={getErrorCondition(state.errors, "maker")}
      helperText={getErroMessage(state.errors, "maker")}
    />
  );


  return (
    <main>
      <h1 className={classes.title}><FontAwesomeIcon icon={faCar} color="#96d4d4" size="1x" /> 車両情報{pageMode === "confirm" ? "確認" : "登録"}</h1>
      <form onSubmit={handleSubmit(pageMode === "confirm" ? doPost : doConfirm)}>
        <div className={classes.container}>
          <div className={classes.list}>
            <span className={classes.label}>メーカー名</span>
            {pageMode === "confirm" ? makerText : makerSelect}
          </div>
          <div className={classes.list}>
            <span className={classes.label}>車種名</span>
            <TextControl
              control={control}
              name="model"
              label="車種名"
              value={state.model}
              readOnly={readOnly}
              error={getErrorCondition(state.errors, "model")}
              helperText={getErroMessage(state.errors, "model")}
            />
          </div>
          <div className={classes.list}>
            <span className={classes.label}>グレード</span>
            <TextControl
              control={control}
              name="grade"
              label="グレード"
              value={state.grade}
              readOnly={readOnly}
              error={getErrorCondition(state.errors, "grade")}
              helperText={getErroMessage(state.errors, "grade")}
            />
          </div>
          <div className={classes.list}>
            <span className={classes.label}>ボディカラー</span>
            <TextControl
              control={control}
              name="bodyColor"
              label="ボディカラー"
              value={state.bodyColor}
              readOnly={readOnly}
              error={getErrorCondition(state.errors, "bodyColor")}
              helperText={getErroMessage(state.errors, "bodyColor")}
            />
          </div>
          <div className={classes.list}>
            <span className={classes.label}>価格</span>
            <TextControl
              control={control}
              name="price"
              label="価格"
              value={state.price}
              readOnly={readOnly}
              error={getErrorCondition(state.errors, "price")}
              helperText={getErroMessage(state.errors, "price")}
            />
          </div>
          <div className={classes.list}>
            <span className={classes.label}>オプション</span>
            <FormControl disabled={check_disabled}>
            <Controller
              render={
                // eslint-disable-next-line react/display-name
              ({ field }) => <Checkbox {...field}>
                checked={state.navi}
              </Checkbox>
            }
              control={control}
              name="navi"
              defaultValue={false}
            />
            </FormControl>
            <span className={classes.check_label}>ナビ</span>
            <FormControl disabled={check_disabled}>
            <Controller
              render={
                // eslint-disable-next-line react/display-name
              ({ field }) => <Checkbox {...field}>
                disabled={check_disabled}
                checked={state.kawa}
              </Checkbox>
            }
              control={control}
              name="kawa"
              defaultValue={false}
            />
            </FormControl>
            <span className={classes.check_label}>革</span>
            <FormControl disabled={check_disabled}>
            <Controller
              render={
                // eslint-disable-next-line react/display-name
              ({ field }) => <Checkbox {...field}>
                disabled={check_disabled}
                checked={state.sr}
              </Checkbox>
            }
              control={control}
              name="sr"
              defaultValue={false}
            />
            </FormControl>
            <span className={classes.check_label}>サンルーフ</span>
          </div>
        </div>

        <div className={classes.btn_submit}>
          <Button
            type="submit"
            variant="contained" 
            color="secondary"
          >
          {pageMode === "confirm" ? "登録" : "確認"}
        </Button>
        </div>
        <div className={classes.bar_container}>
          {pageMode === "confirm" ? backButton : <MenuButton />}
        </div>
      </form>
    </main>
  );
}

// 何故かTSが邪魔しているので
CarCreate.propTypes = {
  pageMode: any,
  location: any,
  field: any
}

export default React.memo(CarCreate);