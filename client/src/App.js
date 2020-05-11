import React, { Fragment, useEffect } from 'react';
import './App.css';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Routes from './components/routing/Routes';



//Redux
import {Provider} from 'react-redux';
import store from './store';


if(localStorage.token){
  setAuthToken(localStorage.token);
}



const App= ()=>{
  
  useEffect( () => {                        // Hooks - useEffect will keep running until we add 2 param to only runs once
     store.dispatch(loadUser());
  },[]);
  
  
  return( 
  <Provider store={store}>
  <Router>
    <Fragment>
      <Navbar />
      <Switch>
      <Route exact path='/' component={Landing} />
      <Route component={Routes} />
      </Switch>
    </Fragment> 
  </Router>
  </Provider>
)};
export default App;
