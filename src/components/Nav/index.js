import React from 'react';
import { AuthUserContext } from '../Session';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

// --- Components --- //
import { Row, Col, Button, Divider } from 'antd';
import { SideMenuButton } from '../SideMenu';

// --- Styles --- //
import '../../styles/_nav.scss';


const Nav = () => (
  <Row type="flex" justify='space-between' align='middle' className='nav-container'>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavAuth user={authUser} /> : <NavNonAuth />
      }
    </AuthUserContext.Consumer>
  </Row>
);


const NavAuth = ({user}) => (
  <Row type="flex" justify='center' align='middle' className='nav-bar'>
    <Col xs={12} className='nav-item-container'>
      <Row type="flex" justify='start' align='middle' className='nav-actions'>
        <Col className='nav-item-wrapper'>
          <Link className='nav-item' to={ROUTES.LANDING}>
            <Button className='nav-link brand' type="link">GCDB-API</Button>
          </Link>
        </Col>
      </Row>
    </Col>
    <Col xs={12} className='nav-item-container'>
      <Row type="flex" justify='end' align='middle' className='nav-actions'>
        <Col className='nav-item-wrapper'>
          <SideMenuButton />
        </Col>
      </Row>
    </Col>    
  </Row>
);


const NavNonAuth = () => (
  <Row type="flex" justify='center' align='middle' className='nav-bar'>
    <Col xs={12} className='nav-item-container '>
      <Row type="flex" justify='start' align='middle' className='nav-actions'>
        <Col className='nav-item-wrapper'>
          <Link className='nav-item' to={ROUTES.LANDING}>
            <Button className='nav-link brand' type="link">GCDB-API</Button>
          </Link>
        </Col>
      </Row>
    </Col>

    <Col xs={12} className='nav-item-container'>
      <Row type="flex" justify='end' align='middle' className='nav-actions'>
        <Col className='nav-item-wrapper' style={{ marginRight: '8px'}}>
          <Link className='nav-item' to={ROUTES.REGISTER}>
            <Button className='nav-link' type="link">Create Account</Button>
          </Link>
        </Col>
  
        <Divider type="vertical" />
  
        <Col className='nav-item-wrapper' style={{ marginLeft: '8px'}}>
          <Link className='nav-item' to={ROUTES.LOGIN}>
            <Button className='nav-link' type="link">Sign In</Button>
          </Link>
        </Col>
        
      </Row>
    </Col>
  </Row>
);


export default Nav;