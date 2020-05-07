import React, { Fragment, useEffect } from 'react';
import './App.css';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
// import CreateProfile from './components/profileForms/CreateProfile';
// import EditProfile from './components/profileForms/EditProfile';
import ProfileForm from './components/profileForms/ProfileForm';
import AddExperience from './components/profileForms/AddExperience';
import AddEducation from './components/profileForms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from '../src/components/profile/Profile';


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
      <Route exact path='/' component={Landing} />
      <section className='container'>
        <Alert />
        <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/profiles' component={Profiles} />
        <Route exact path='/profile/:id' component={Profile} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />   {/*Force user to login before going to dashboard */}
        <PrivateRoute exact path='/create-profile' component={ProfileForm} /> 
        <PrivateRoute exact path='/edit-profile' component={ProfileForm} /> 
        <PrivateRoute exact path='/add-experience' component={AddExperience} /> 
        <PrivateRoute exact path='/add-education' component={AddEducation} /> 
        </Switch>
      </section>    
    </Fragment> 
  </Router>
  </Provider>
)};
export default App;
