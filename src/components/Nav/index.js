import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { Button, Row, Col } from 'antd';

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
      
    </Col>
    
    <Col span={8} className='nav-item-wrapper'>
      <Link to={ROUTES.LANDING} className='nav-item'>GCDB-API</Link>
    </Col>
    
    <Col span={8} className='nav-item-wrapper'>
      <Button>
        <Link className='nav-item'>Sign Out</Link>
      </Button>
    </Col>
  </Row>
);

const NavNonAuth = () => (
  <Row type="flex" justify='center' align='middle' className='nav-bar'>
    
    <Col span={8} className='nav-item-wrapper'>
      <Link to={ROUTES.REGISTER} className='nav-item'>Sign Up</Link>
    </Col>
    
    <Col span={8} className='nav-item-wrapper'>
      <Link to={ROUTES.LANDING} className='nav-item'>GCDB-API</Link>
    </Col>
    
    <Col span={8} className='nav-item-wrapper'>
      <Button>
        <Link className='nav-item'>Sign In</Link>
      </Button>
    </Col>
    
  </Row>

);

export default Nav;