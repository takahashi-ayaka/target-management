// エントリポイント
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

// Page components
import Login from "./pages/login";
import Menu from "./pages/menu";
import Users from "./pages/users";
import UserForm from "./pages/users/UserForm";
import UserCreate from "./pages/users/UserCreate";
import Items from "./pages/items";
import Car from "./pages/car";
import CarCreate from "./pages/car/CarCreate";
import CarForm from "./pages/car/CarForm";
import CarComplete from "./pages/car/CarComplete";
import CarSearch from "./pages/car/indexSearch";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/menu" component={Menu} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/users/new" >
          <UserCreate pageMode="new" />
        </Route>        
        <Route exact path="/users/new/edit" >
          <UserCreate pageMode="new" />
        </Route>  
        <Route exact path="/users/:id" >
          <UserForm pageMode="show" />
        </Route>
        <Route exact path="/users/:id/edit" >
          <UserForm pageMode="edit" />
        </Route>
        <Route exact path="/items" component={Items} />
        <Route exact path="/carCreate" component={Car} />
        <Route exact path="/carCreate/new" >
          <CarCreate pageMode="new" />
        </Route>        
        <Route exact path="/carCreate/new/edit" >
          <CarCreate pageMode="new" />
        </Route>  
        <Route exact path="/carCreate/complete" >
          <CarComplete pageMode="complete" />
        </Route>        
        <Route exact path="/car" component={CarSearch} />
        <Route exact path="/car/:id" >
          <CarForm pageMode="show" />
        </Route>
        <Route exact path="/car/:id/edit" >
          <CarForm pageMode="edit" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

// このDOMに差し込みます
const app = document.getElementById('app');
ReactDOM.render(<App />, app);
