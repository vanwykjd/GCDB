import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext, withAuthorization } from '../Session';

// --- Components --- //
import { Row, Form, Icon, Input, Button, Alert } from 'antd';


const PasswordResetPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <PasswordResetForm />
    )}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE = {
  password: '',
  password_confirm: '',
  error: null,
};

class PasswordResetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { password } = this.state;

    this.props.firebase
      .doPasswordUpdate(password)
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
    const { password, password_confirm, error, loading } = this.state;

    const isInvalid =
      password !== password_confirm || password_confirm === '';

    return (
      <Row type="flex" justify="center" align="middle" className='session-form'>
        <Row type="flex" justify="center" align="middle" className='form-header'>
          <h1>GCDB-API</h1>
          <h2>Change Your Password</h2>
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
              New Password:
            </div>
  
            <Input 
              name="password"
              value={password}
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              onChange={this.onChange}
              type="password"
              placeholder="Enter new password"
            />
          </Row>
      
          <Row type="flex" justify="center" align="middle" className='form-input'>
            <div className='input-lable'>
              Confirm New Password:
            </div>
  
            <Input 
              name="password_confirm"
              value={password_confirm}
              onChange={this.onChange}
              type="password"
              autoComplete="new-password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Enter new password confirmation"
            />
          </Row>
          
          <Row type="flex" justify="center" align="middle" className='form-actions-container'>
            <Row type="flex" justify="center" align="middle" className='form-btn-container'>
              <Button type="primary" htmlType="submit" className="create-account-btn" disabled={isInvalid}>
                Reset My Password
              </Button>
            </Row>
          </Row>
        </Form>
      </Row>
    );
  }
}

const PasswordResetLink = () => (
  <Row type="flex" justify="center" align="middle" className='form_link'>
    <Link to={ROUTES.PW_RESET}>Change My Password</Link>
  </Row>
);

const PasswordResetForm = compose(
  withRouter,
  withFirebase,
)(PasswordResetFormBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(PasswordResetPage);
export { PasswordResetForm, PasswordResetLink};