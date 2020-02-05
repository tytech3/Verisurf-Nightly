import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Auth from './pages/Auth.js';
import * as serviceWorker from './serviceWorker';
import { Route, Switch, HashRouter } from 'react-router-dom'
import 'typeface-roboto';
import Layout from './Layout.js';

var authenticated = false;
let routing

try{
  authenticated = localStorage.getItem("auth");
}
catch(e){
  authenticated = false;
}

if(authenticated){
      routing = (
        <HashRouter>
              <Route exact path="" component={Layout} />
        </HashRouter>
      )
    }
else{
  routing = (
    <HashRouter>
      <Switch>
          <Route exact path="" component={Auth}/>
          <Route path="/dashboard">
            <Layout />
          </Route>
        </Switch>
    </HashRouter>
  )
}

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


