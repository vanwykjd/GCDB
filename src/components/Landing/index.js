import React from 'react';

import { Row, Col } from 'antd';
import { AuthUserContext } from '../Session';

// --- Components --- //
import LoginForm from '../Login';

// --- Styles --- //
import '../../styles/_landing.scss';

const Landing = ({ authUser }) => (
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? null : <LandingPage />
      }
    </AuthUserContext.Consumer>
);

const LandingPage = () => (
  <Row type="flex" justify="center" align="middle" className="page-container">
    <Row type="flex" justify="space-between" align="middle" className="banner">
      <Col xs={24} md={12} className='greeting'>
        <Row type="flex" justify="start" align="middle" className='greeting-wrapper'>
          <h1>GCDB-API</h1>

          <h2>Golf course data for the people, by the people</h2>
          <p>A platform enabling users to create, edit and access golf courses within the GCDB</p>
        </Row>
      </Col>

      <Col xs={24} md={12} className='banner-login'>
        <Row type="flex" justify="end" align="middle" className='form-wrapper'>
          <LoginForm />
        </Row>
      </Col>
    </Row>
  </Row>
);


export default Landing;