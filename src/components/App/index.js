import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

// --- Components --- //
import { Row } from 'antd';
import Nav from '../Nav';

import Landing from '../Landing';
import RegisterPage from '../Register';
import LoginPage from '../Login';
import PwForgetPage from '../PwForget';
import PwResetPage from '../PwReset';
import DashboardPage from '../Dashboard';

//import EditClubPage from '../Club/Edit';

// --- Styles --- //
import '../../styles/_app.scss';
import '../../styles/_antd.scss';
import '../../styles/_forms.scss';

const App = () => (
  <Router>
    <Row type="flex" justify="center" align="middle" className="App">
      <Row type="flex" justify="center" align="middle" className="nav-wrapper">
        <Nav />
      </Row>
      <Row type="flex" justify="center" align="top" className="page-wrapper">
        <Route exact path={ROUTES.LANDING} component={Landing} />
        <Route path={ROUTES.LANDING} component={DashboardPage} />
        <Route exact path={ROUTES.REGISTER} component={RegisterPage} />
        <Route exact path={ROUTES.LOGIN} component={LoginPage} />
        <Route exact path={ROUTES.PW_FORGET} component={PwForgetPage} />
        <Route exact path={ROUTES.PW_RESET} component={PwResetPage} />
        
      </Row>
    </Row>
  </Router>
);



export default withAuthentication(App);