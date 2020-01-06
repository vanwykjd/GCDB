import React from 'react';

import { Row } from 'antd';
import { AuthUserContext } from '../Session';

// --- Components --- //
import RegisterForm from '../Register';

// --- Styles --- //
import '../../styles/_landing.scss';

const LandingAuth = ({ authUser }) => (
  <Row type="flex" justify="center" align="middle" className="page-content">
    <h2>Hello, {authUser.email}</h2>
  </Row>
);

const LandingNonAuth = () => (
  <Row type="flex" justify="center" align="middle" className="page-content">
    <Row type="flex" justify="center" align="middle" className="intro">
      <p>
        A platform specifically designed to simplify the process
        of creating and editing golf course data that is accessible to all.
      </p>
    </Row>
    <Row type="flex" justify="center" align="middle" className="page-content">
      <RegisterForm />
    </Row>
  </Row>
);

const Landing = () => (
  <Row type="flex" justify="center" align="middle" className='page-container'>
    <Row type="flex" justify="center" align="middle" className="greeting">
      <h1>Welcome to GCDB-API</h1>
      <h3>A Golf Course DB created for the people, by the people.</h3>
    </Row>
    
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <LandingAuth authUser={authUser} /> : <LandingNonAuth />
      }
    </AuthUserContext.Consumer>
  </Row>
);

export default Landing;