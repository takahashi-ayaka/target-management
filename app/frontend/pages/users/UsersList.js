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

const UsersList = (props) => {
  const userList = props.users;
  const history = useHistory();
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: "#D496A5"}}>
            <TableCell className={classes.cells}>ID</TableCell>
            <TableCell className={classes.cells}>名前</TableCell>
            <TableCell className={classes.cells}>権限</TableCell>
            <TableCell className={classes.cells}>詳細</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            userList.map((user, idx) => (
              <TableRow key={idx}>
                <TableCell className={classes.body_cells}>{user.id}</TableCell>
                <TableCell className={classes.body_cells}>{user.user_name}</TableCell>
                <TableCell className={classes.body_cells}>{user.authority}</TableCell>
                <TableCell className={classes.body_cells}>
                  <Button 
                    type="button"
                    variant="contained" 
                    color="primary"
                    onClick={() => { history.push(`/users/${user.id}`) }}
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
UsersList.propTypes = {
  users: any
}


export default React.memo(UsersList);
