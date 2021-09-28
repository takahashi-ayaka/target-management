import { any } from "prop-types";
import React from "react"
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      // display: 'flex',
      flexWrap: 'wrap',
      width: '85%',
      margin: `${theme.spacing(0)} auto`
    },
    cells: {
      textAlign: 'center',
      color: '#fff'
    },
    body_cells: {
      textAlign: 'center'
    }
  })
);

const CarList = (props) => {
  const carList = props.car;
  const history = useHistory();
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: "#D496A5"}}>
            <TableCell className={classes.cells}>メーカー名</TableCell>
            <TableCell className={classes.cells}>車種名</TableCell>
            <TableCell className={classes.cells}>グレード</TableCell>
            <TableCell className={classes.cells}>ボディカラー</TableCell>
            <TableCell className={classes.cells}>価格</TableCell>
            <TableCell className={classes.cells}>ナビ</TableCell>
            <TableCell className={classes.cells}>革</TableCell>
            <TableCell className={classes.cells}>サンルーフ</TableCell>
            <TableCell className={classes.cells}>詳細</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            carList.map((car, idx) => (
              <TableRow key={idx}>
                <TableCell className={classes.body_cells}>{car.maker}</TableCell>
                <TableCell className={classes.body_cells}>{car.model}</TableCell>
                <TableCell className={classes.body_cells}>{car.grade}</TableCell>
                <TableCell className={classes.body_cells}>{car.bodyColor}</TableCell>
                <TableCell className={classes.body_cells}>￥{car.price.toLocaleString()}</TableCell>
                <TableCell className={classes.body_cells}>{car.navi == '1' ? '○' : '-'}</TableCell>
                <TableCell className={classes.body_cells}>{car.kawa == '1' ? '○' : '-'}</TableCell>
                <TableCell className={classes.body_cells}>{car.sr == '1' ? '○' : '-'}</TableCell>
                <TableCell className={classes.body_cells}>
                  <Button 
                    type="button"
                    variant="contained" 
                    color="primary"
                    onClick={() => { history.push(`/car/${car.carId}`) }}
                  >
                    詳細
                  </Button>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
// 何故かTSが邪魔しているので
CarList.propTypes = {
  car: any
}


export default React.memo(CarList);
