import { any } from "prop-types";
import React, { useEffect, useReducer, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import TextControl from "../../components/form/TextControl";
import CarRegisterButtonControl from "./CarRegisterButtonControl";
// import CarRegisterBackButtonControl from "./CarRegisterBackButtonControl";
import axios from "axios";
import Checkbox from '@material-ui/core/Checkbox';
import { getErrorCondition, getErroMessage} from "../../common/error"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { InputLabel, FormControl, FormHelperText, Select, MenuItem } from "@material-ui/core";
import MenuButton from "../../components/MenuButton";

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
  carId: undefined,
  maker: undefined,
  model: undefined,
  grade: undefined,
  bodyColor: undefined,
  price: undefined,
  navi: undefined,
  kawa: undefined,
  sr: undefined,
  errors: {}
}

// car reducer
const reducer = (state, action) => {

  switch(action.type) {
    case "GET_CAR":
      return {...state,
        carId: action.payload.carId,
        maker: action.payload.maker,
        model: action.payload.model,
        grade: action.payload.grade,
        bodyColor: action.payload.bodyColor,
        price: action.payload.price,
        navi: action.payload.navi,
        kawa: action.payload.kawa,
        sr: action.payload.sr,
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

const CarForm = (props) => {
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

  // carデータ取得
  const getCarInfo = async () => {
    const url = `/api/car/${id}`;

    await axios.get(url).then(
      (response) => {
        const car = response.data.car;
        dispatch ({type: 'GET_CAR', payload: car})
      }
    ).catch (
      (error) => {
        if (error.response.status === 404 ) {
          // 一旦アラート表示して検索画面に逃してしまう
          alert("該当ユーザが存在しないよ。。");
          history.push("/car");
        } else {
          // その他はサーバサイドエラーとしてしまう。
          history.push('/');
        }
      }
    )
  }

  // car 入力チェック
  const doConfirm = async (data) => {
    const url = `/api/car/${id}/confirm`;
    const carJSON = `{"car": ${JSON.stringify(data)}, "mode": "edit"}`

    await axios.post(url, JSON.parse(carJSON))
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
          history.push("/car");
        } else {
          // その他はサーバサイドエラーとしてしまう。
          history.push('/');
        }
      }
    );
  }

  // car 登録更新
  const doPost = async (data) => {
    const url = `/api/car/${id}/update`;
    const carJSON = `{"car": ${JSON.stringify(data)}, "mode": "edit"}`

    axios.patch(url, JSON.parse(carJSON))
    .then(
      () => {
        alert("登録しました。");
        history.push("/car");
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
    getCarInfo(id);
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
  if (state.carId === undefined){
    return <></>;
  }

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
      <h1 className={classes.title}><FontAwesomeIcon icon={faCar} color="#a1d496" size="1x" /> 車両情報
      {pageMode === "show" && ("詳細")}{pageMode === "edit" && ("更新")}{pageMode === "confirm" && ("更新確認")}
      </h1>
      <form onSubmit={handleSubmit(pageMode === "confirm" ? doPost : doConfirm)}>
        <div className={classes.container}>
          <div className={classes.list}>
            <span className={classes.label}>メーカー名</span>
            {pageMode === "show" ? makerText : makerSelect}
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
            <FormControl disabled={readOnly}>
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
            <FormControl disabled={readOnly}>
            <Controller
              render={
                // eslint-disable-next-line react/display-name
              ({ field }) => <Checkbox {...field}>
                disabled={readOnly}
                checked={state.kawa}
              </Checkbox>
            }
              control={control}
              name="kawa"
              defaultValue={false}
            />
            </FormControl>
            <span className={classes.check_label}>革</span>
            <FormControl disabled={readOnly}>
            <Controller
              render={
                // eslint-disable-next-line react/display-name
              ({ field }) => <Checkbox {...field}>
                disabled={readOnly}
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
          <CarRegisterButtonControl
            id={id}
            pageMode={pageMode}
            useState={setPageMode}
            dispatch={dispatch}
            setDummy={setDummy}  // Material-UIのTextFieldリフレッシュ用useState
            reset={reset}
          />
        </div>
        <div className={classes.bar_container}>
          <MenuButton />
        </div>
      </form>
    </main>
  );
}

// 何故かTSが邪魔しているので
CarForm.propTypes = {
  pageMode: any,
  location: any,
  field: any
}

export default React.memo(CarForm);
