import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

// --- Components --- //
import { Row, Col, Form, Icon, Input, Button, Divider, Alert } from 'antd';

const LoginPage = () => ( <LoginForm  /> );

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  loading: false,
};
                
                         
class LoginFormBase extends Component {
  constructor(props) {
    super(props);
    
    this.state = { ...INITIAL_STATE };
  }

  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }


  onChange = event => {
    this.setState({ [event.target.name]: event.target.value, error: false });
  };


  onSubmit = event => {
    event.preventDefault();
    
    this.setState({ loading: true });
    const { email, password } = this.state;
    let error = this.state.error;
    
    const invalidEmail = (email) ? email.includes(" ") : true;
    const invalidPassword = (password) ? password.includes(" ") : true;
    
    if (invalidEmail || invalidPassword) {
      error = { message: 'Invalid email or password.' };
      this.setState({ loading: false, error });
    } else {
      this.props.firebase
        .doSignInWithEmailAndPassword(email, password)
        .then(() => {
          
          setTimeout(() => { this.props.history.push(ROUTES.LANDING)}, 300);
        })
        .catch(error => {
          console.log(error);
          if (error.code === 'auth/wrong-password') {
            error.message = 'Incorrect password';
          } else if (error.code === 'auth/user-not-found') {
            error.message = 'Incorrect email address.';
          }
          this.setState({ error, loading: false });
        });
    }
  };
  

  render() {
    const { email, password, loading } = this.state;
    const error = (this.state.error || this.props.error);

    
    return (
      <Row type="flex" justify="center" align="middle" className='session-form'>
      
        <Row type="flex" justify="center" align="middle" className='form-header'>
          <h1>GCDB-API</h1>
          <h2>Sign in to GCDB-API</h2>
        </Row>
      
        { loading && 
          <div className='loading-page'>
            <Row type="flex" justify="center" align="middle" className='loading-container'>
              <Icon type="loading" />
            </Row>
          </div> 
        }
        
        { error && 
          <Row type="flex" justify="center" align="middle" className='error-modal'>
            <Alert
              message={error.message}
              type="error"
              closable
            />
          </Row>
        }
      
        <Form onSubmit={this.onSubmit} className='form-container'>
          <Row type="flex" justify="center" align="middle" className='form-input'>
            <div className='input-lable'>
              Email:
            </div>

            <Input 
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              autoComplete="new-email"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter email"
            />
          </Row>
      
          <Row type="flex" justify="center" align="middle" className='form-input'>
            <Row type="flex" justify="space-between" align="middle" className='input-lable'>
              <Col>Password:</Col>
              <Col className='sub-lable'>
                <Link to={ROUTES.PW_FORGET}>Forgot password?</Link>
              </Col>
            </Row>

            <Input 
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              autoComplete="new-password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter password"
            />
          </Row>

          <Row type="flex" justify="center" align="middle" className='form-actions-container'>
            <Row type="flex" justify="center" align="middle" className='form-btn-container'>
              <Button type="primary" htmlType="submit" className="login-btn">
                Sign In
              </Button>
            </Row>

            <Divider>New to GCDB-API?</Divider>

            <Row type="flex" justify="center" align="middle" className='form-btn-container'>
              <Link to={ROUTES.REGISTER} style={{ width: '100%', marginTop: '0px'}}>
                <Button className="create-account-btn">Create Account</Button>
              </Link>
            </Row>
          </Row>
        </Form>
      </Row>
    );
  }
}

const LoginForm = compose(
  withRouter,
  withFirebase,
)(LoginFormBase);

export default LoginPage;

export { LoginForm };