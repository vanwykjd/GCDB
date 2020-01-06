import React from 'react';
import { AuthUserContext } from '../Session';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';



// --- Components --- //
import { Row, Col, Button } from 'antd';
import  LogOutButton  from '../Logout';

// --- Styles --- //
import '../../styles/_nav.scss';


const Nav = () => (
  <div className='nav-container'>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavAuth /> : <NavNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavAuth = () => (
  <Row type="flex" justify='center' align='middle' className='nav-bar'>
    <Col span={8} className='nav-item-wrapper'>
      <Link to={ROUTES.PW_RESET} className='nav-item'>Reset Password</Link>
    </Col>
    
    <Col span={8} className='nav-item-wrapper'>
      <Link to={ROUTES.LANDING} className='nav-item primary'>GCDB-API</Link>
    </Col>
    
    <Col span={8} className='nav-item-wrapper'>
      <LogOutButton />
    </Col>
  </Row>
);

const NavNonAuth = () => (
  <Row type="flex" justify='center' align='middle' className='nav-bar'>
    
    <Col span={8} className='nav-item-wrapper'>
      <Link to={ROUTES.REGISTER} className='nav-item'>Sign Up</Link>
    </Col>
    
    <Col span={8} className='nav-item-wrapper'>
      <Link to={ROUTES.LANDING} className='nav-item primary'>GCDB-API</Link>
    </Col>
    
    <Col span={8} className='nav-item-wrapper'>
      <Button>
        <Link className='nav-item' to={ROUTES.LOGIN}>Sign In</Link>
      </Button>
    </Col>
    
  </Row>

);

export default Nav;