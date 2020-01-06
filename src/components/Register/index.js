import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

// --- Components --- //
import { Row, Form, Icon, Input, Button } from 'antd';

// --- Styles --- //
import '../../styles/_session_forms.scss';

const RegisterPage = () => (
  <Row type="flex" justify="center" align="middle" className='form-page'>
    <Row type="flex" justify="center" align="middle" className='form-header'>
      <h1>Create Account</h1>
    </Row>
    <RegisterForm />
  </Row>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  password_confirm: '',
  error: null,
};

class RegisterFormBase extends Component {
  constructor(props) {
    super(props);
    
    this.state = {...INITIAL_STATE };
  }
  
  onSubmit = event => {
    const {email, password} = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
          return this.props.firebase
            .user(authUser.user.uid)
            .set({
              email,
          });
      })
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
    console.log(event.target.name, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, password_confirm, error } = this.state;
    const isInvalid =
          email === '' || 
          password === '' ||
          password_confirm === '' ||
          password !== password_confirm;
    
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
      
        <Form.Item>
          <Input 
            name="password_confirm"
            value={password_confirm}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={this.onChange}
            type="password"
            autoComplete="new-password"
            placeholder="Confirm Password"
          />
        </Form.Item>
      
        <Row type="flex" justify="center" align="middle">
          <Button type="primary" htmlType="submit" className="login-form-button" disabled={isInvalid}>
            Create Account
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

const RegisterForm = compose(
  withRouter,
  withFirebase,
)(RegisterFormBase);

export default RegisterPage;

export { RegisterForm };