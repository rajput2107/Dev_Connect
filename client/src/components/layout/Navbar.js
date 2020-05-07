import React, { Fragment } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from '../../actions/auth';
import PropTypes from 'prop-types';

const Navbar = ( { auth: {isAuthenticated, loading}, logout } ) => {

    const authLinks = (
      <ul>
          <li><Link to="/profiles"> 
          Developers
          </Link>
          </li>

          <li><Link to="/dashboard">
          <i className="fas fa-user"></i>{' '} 
          <span className='hide-sm'> 
          Dashboard
          </span>
          </Link>
          </li>

          <li>
            <a onClick={logout} href="#!">
            <i className="fas fa-sign-out-alt"></i>{' '}        
            <span className='hide-sm'>Logout</span>                                                     
            </a>                                                
          </li>
    </ul>
    );
      //  We have a CSS class hide-sm which hides something on small screen devices to make it responsive & we
      //  don't want text to show on mobile devices only just the icons that's why we are wrapping Logout inside a span with hide-sm class
    
      const guestLinks = (
      <ul>
          <li><Link to="/profiles">Developers</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
    </ul>
    );

    return (
        <nav className="navbar bg-dark">
        <h1>
          <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
        </h1>
        {/* If not loading then do render Fragment and then ternary opertion */}
        { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks}</Fragment>)}
        
        </nav>
    );
  }


Navbar.propTypes= {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state =>({
  auth: state.auth
});



export default connect(mapStateToProps,{logout})(Navbar);
