import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

// --- Components --- //
import Nav from '../Nav';
import Landing from '../Landing';
import RegisterPage from '../Register';
import LoginPage from '../Login';
import PwForgetPage from '../PwForget';
import PwResetPage from '../PwReset';

// --- Styles --- //
import '../../styles/_app.scss';

const App = () => (
  <Router>
    <div className='App'>
      <Nav />
      <Route exact path={ROUTES.LANDING} component={Landing} />
      <Route path={ROUTES.REGISTER} component={RegisterPage} />
      <Route path={ROUTES.LOGIN} component={LoginPage} />
      <Route path={ROUTES.PW_FORGET} component={PwForgetPage} />
      <Route path={ROUTES.PW_RESET} component={PwResetPage} />
    </div>
  </Router>
);

export default withAuthentication(App);