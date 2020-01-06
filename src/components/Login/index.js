import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

// --- Components --- //
import { Row, Form, Icon, Input, Button } from 'antd';
import { PasswordForgetLink } from '../PwForget';

// --- Styles --- //
import '../../styles/_session_forms.scss';

const LoginPage = () => (
  <Row type="flex" justify="center" align="middle" className='form-page'>
    <Row type="flex" justify="center" align="middle" className='form-header'>
      <h1>Sign In</h1>
    </Row>
    <LoginForm />
    <PasswordForgetLink />
  </Row>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class LoginFormBase extends Component {
  constructor(props) {
    super(props);
    
    this.state = { ...INITIAL_STATE };
  }
  
  onSubmit = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LANDING);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };
  
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  
  render() {
    const { email, password, error } = this.state;
    const isInvalid = email === '' || password === '';
    
    return (
      <Form onSubmit={this.onSubmit} className="account-form">
    
        <Form.Item>
          <Input
            name="email"
            value={email}
            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={this.onChange}
            type="text"
            autoComplete="new-email"
            placeholder="Email"
          />
        </Form.Item>
      
        <Form.Item>
          <Input 
            name="password"
            value={password}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={this.onChange}
            type="password"
            autoComplete="new-password"
            placeholder="Password"
          />
        </Form.Item>
      
        <Row type="flex" justify="center" align="middle" className='session-btn-container'>
          <Button type="primary" htmlType="submit" className="login-form-button" disabled={isInvalid}>
            Sign In
          </Button>
        </Row>
      
        <Row type="flex" justify="center" align="middle" className='error-msg'>
          { error && 
            <p>{error.message}</p>
          }
        </Row>
      </Form>
    );
  }
}

const LoginForm = compose(
  withRouter,
  withFirebase,
)(LoginFormBase);

export default LoginPage;

export { LoginForm };