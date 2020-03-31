import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

// --- Components --- //
import { Row, Form, Icon, Input, Button, Alert } from 'antd';

const RegisterPage = () => ( <RegisterForm /> );

const INITIAL_STATE = {
  username: '',                 
  email: '',
  password: '',
  password_confirm: '',
  error: null,
  loading: false,
};

                            
class RegisterFormBase extends Component {
  constructor(props) {
    super(props);
    
    this.state = {...INITIAL_STATE };
  }
  

  onSubmit = event => {
    event.preventDefault();
    
    this.setState({ loading: true });
    const {email, password, password_confirm} = this.state;
    let error = this.state.error;

    const invalidEmail = (email) ? email.includes(" ") : true;
    const invalidPassword = (password) ? password.includes(" ") : true;
    const invalidPasswordConf = (password_confirm) ? password_confirm.includes(" ") : true;
    
    if (invalidEmail || invalidPassword || invalidPasswordConf) {
      error = { message: 'Invalid email, password or password confirmation.' };
      this.setState({ loading: false, error });
    } else if (password !== password_confirm) {
      error = { message: 'Password and password confirmation do not match.' };
      this.setState({ loading: false, error });
    } else {

      this.props.firebase
        .doCreateUserWithEmailAndPassword(email, password)
        .then(authUser => {
          return this.props.firebase
            .user(authUser.user.uid)
            .set({
              email: email.toLowerCase(),
              username: email.split('@')[0].toString().replace('.', '-').toLowerCase()
            });
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LANDING);
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
    }
  };
  

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value, error: false  });
  };


  render() {
    const { email, password, password_confirm, error, loading } = this.state;

    
    return (
      <Row type="flex" justify="center" align="middle" className='session-form'>
        <Row type="flex" justify="center" align="middle" className='form-header'>
          <h1>GCDB-API</h1>
          <h2>Create your account</h2>
        </Row>
      
        { loading && 
          <div className='loading-page'>
            <Row type="flex" justify="center" align="center" className='loading-container'>
              <Icon type="loading" />
            </Row>
          </div> 
        }
        
        { error && 
          <Row type="flex" justify="center" align="middle" className='error-modal'>
            <Alert
              message={error.message}
              type="error"
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
            <div className='input-lable'>
              Password:
            </div>

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
      
          <Row type="flex" justify="center" align="middle" className='form-input'>
            <div className='input-lable'>
              Confirm Password:
            </div>

            <Input 
              name="password_confirm"
              value={password_confirm}
              onChange={this.onChange}
              type="password"
              autoComplete="new-password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter password confirmation"
            />
          </Row>

          <Row type="flex" justify="center" align="middle" className='form-actions-container'>
            <Row type="flex" justify="center" align="middle" className='form-btn-container'>
              <Button type="primary" htmlType="submit" className="create-account-btn">
                Create Account
              </Button>
            </Row>
            <Row type="flex" justify="center" align="middle" className='form-btn-container'>
              <Link to={ROUTES.LOGIN} style={{ marginTop: '8px'}}>
                <Button className="create-account-btn" type='link'>Already have an account?</Button>
              </Link>
            </Row>
          </Row>
        </Form>
      </Row>
    );
  }
}

const RegisterForm = compose(
  withRouter,
  withFirebase,
)(RegisterFormBase);

export default RegisterPage;

export { RegisterForm };