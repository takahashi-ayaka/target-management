import React from "react"
import MenuButton from "../../components/MenuButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      textAlign: 'center',
      flexWrap: 'wrap',
      margin: `${theme.spacing(0)} auto`
    },
    title: {
      padding: "0.25em 0.5em",
      color: "#797979",
      borderLeft: "solid 5px #ffaf58"
    },
    btn_submit: {
      textAlign: 'center',
      flexWrap: 'wrap',
      margin: `${theme.spacing(0)} auto`,
      marginTop: 55
    }
  })
);

const CarComplete = () => {
  const classes = useStyles();
  return (
    <main>
      <h1 className={classes.title}><FontAwesomeIcon icon={faCar} color="#96d4d4" size="1x" /> 車両情報登録完了</h1>
      <form>
        <div className={classes.container}>
          <h2><FontAwesomeIcon icon={faCheckCircle} color="#D496A5" size="3x" /></h2>
          <label>登録が完了しました</label>
        </div>
        <div className={classes.btn_submit}>
          <MenuButton />
        </div>
      </form>
    </main>
  );
}

export default React.memo(CarComplete);
