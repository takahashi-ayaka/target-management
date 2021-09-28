import React, { useState } from "react";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import { useForm, Controller } from "react-hook-form";
import { any } from "prop-types";
import axios from "axios";
import CarList from "./CarList";
import { useHistory } from "react-router";
import MenuButton from "../../components/MenuButton"
import { InputLabel, FormControl, Select, MenuItem } from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      // display: 'flex',
      flexWrap: 'wrap',
      margin: `${theme.spacing(0)} auto`
    },
    container_1: {
      marginLeft: "8%",
      display: "inline-block"
    },
    container_2: {
      position: "absolute",
      marginLeft: "8%",
      display: "inline-block"
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
    },
    label: {
      display: "inline-block",
      width: 115,
      lineHeight: "45px"
    },
    list: {
      marginBottom: 10
    },
    check_label: {
      display: "inline-block",
      lineHeight: "45px"
    },
    btn_submit: {
      textAlign: 'center',
      flexWrap: 'wrap',
      margin: `${theme.spacing(0)} auto`
    }
  })
);

const Car = () => {
  const {control, handleSubmit} = useForm();
  const [CarsResult, setCarsResult] = useState([]);
  const [searchResult, setSearchResult] = useState('検索してください');
  const history = useHistory();
  const classes = useStyles();

  const doSearch = async (data) => {
    
    const url = "/api/car";
    const searchJSON = `{"params": ${JSON.stringify(data)}}`
    
    await axios.get(url, JSON.parse(searchJSON))
    .then(
      (response) => {
        setCarsResult(response.data.car);
      }
    ).catch(
      (error) => {
        if (error.response.status === 404 ) {
          // エラーメッセージを取得
          setSearchResult('検索結果が見つかりませんでした');
          setCarsResult([]);
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
      <h1 className={classes.title}><FontAwesomeIcon icon={faSearch} color="#a1d496" size="1x" /> 車両情報検索</h1>
      <form onSubmit={handleSubmit(doSearch)}>
        <div className={classes.container}>
          <div className={classes.container_1}>
            <div className={classes.list}>
              <span className={classes.label}>メーカー名</span>
              <FormControl style={{minWidth:150}}>
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
                  defaultValue=""
                />
              </FormControl>
            </div>
            <div className={classes.list}>
              <span className={classes.label}>車種名</span>
              <Controller
                name="model"
                control={control}
                defaultValue=""
                render={
                  function render ({ field:{ value, onChange } }) {
                    return (
                      <TextField
                        label="車種名"
                        variant="outlined"
                        onChange={onChange}
                        value={value}
                      />
                    );             
                  }
                }
              />
            </div>
            <div className={classes.list}>
              <span className={classes.label}>グレード</span>
              <Controller
                name="grade"
                control={control}
                defaultValue=""
                render={
                  function render ({ field:{ value, onChange } }) {
                    return (
                      <TextField
                        label="グレード"
                        variant="outlined"
                        onChange={onChange}
                        value={value}
                      />
                    );             
                  }
                }
              />
            </div>
            <div className={classes.list}>
              <span className={classes.label}>ボディカラー</span>
              <Controller
                name="bodyColor"
                control={control}
                defaultValue=""
                render={
                  function render ({ field:{ value, onChange } }) {
                    return (
                      <TextField
                        label="ボディカラー"
                        variant="outlined"
                        onChange={onChange}
                        value={value}
                      />
                    );             
                  }
                }
              />
            </div>
          </div>
          <div className={classes.container_2}>
            <div className={classes.list}>
              <span className={classes.label}>価格</span>
              <Controller
                name="price_down"
                control={control}
                defaultValue=""
                render={
                  function render ({ field:{ value, onChange } }) {
                    return (
                      <TextField
                        label="価格下限"
                        variant="outlined"
                        onChange={onChange}
                        value={value}
                      />
                    );             
                  }
                }
              />
              <span className={classes.check_label}>~</span>
              <Controller
                name="price_up"
                control={control}
                defaultValue=""
                render={
                  function render ({ field:{ value, onChange } }) {
                    return (
                      <TextField
                        label="価格上限"
                        variant="outlined"
                        onChange={onChange}
                        value={value}
                      />
                    );             
                  }
                }
              />
            </div>
            <div className={classes.list}>
              <span className={classes.label}>オプション</span>
              <FormControl>
              <Controller
                name="navi"
                control={control}
                defaultValue=""
                render={
                  // eslint-disable-next-line react/display-name
                  ({ field }) => <Checkbox {...field}>
                    checked={'1'}
                  </Checkbox>
                }
              />
              </FormControl>
              <span className={classes.check_label}>ナビ</span>
              <FormControl>
              <Controller
                name="kawa"
                control={control}
                defaultValue=""
                render={
                  // eslint-disable-next-line react/display-name
                  ({ field }) => <Checkbox {...field}>
                    checked={'1'}
                  </Checkbox>
                }
              />
              </FormControl>
              <span className={classes.check_label}>革</span>
              <FormControl>
              <Controller
                name="sr"
                control={control}
                defaultValue=""
                render={
                  // eslint-disable-next-line react/display-name
                  ({ field }) => <Checkbox {...field}>
                    checked={'1'}
                  </Checkbox>
                }
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
              style={{ width: "85px"}}
            >
              検索<span style={{ marginLeft: "5%"}}><FontAwesomeIcon icon={faSearch} size="1x" /></span>
            </Button>
          </div>
          <div className={classes.bar_container}>
            <MenuButton />
          </div>
        </div>
      </form>
      <br/>
      {
        CarsResult.length === 0 ?
        <div className={classes.search__result}>{searchResult}</div>
        :
        <CarList car={CarsResult} />
      }
    </main>
  );
}
// 何故かTSが邪魔しているので
Car.propTypes = {
  field: any,
  fieldState: any
}

export default React.memo(Car);
