import React,{Fragment,useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {login} from '../../actions/auth';
import PropTypes from 'prop-types';



const Login = ({login, isAuthenticated})=>{
    const [formData,setFormData] =useState({
        email:'',
        password:''
    });

    const {email,password}=formData;

    const onChange = e => setFormData({...formData,[e.target.name]: e.target.value});
    const onSubmit = async e =>{
      e.preventDefault();
       // console.log('SUCCESS');
       login(email,password);
    };


    //Redirect if logged In
    if(isAuthenticated){
      return <Redirect to="/dashboard" />;
    }

    return <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password} 
            onChange={e => onChange(e)} 
            minLength="6"
          />
        </div>
        
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
};


Login.propTypes= {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};


const mapStateToProps = state =>({
  //auth: state.auth                                  // It will give everything inside initial state in authjs reducer
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps,{login})(Login);
