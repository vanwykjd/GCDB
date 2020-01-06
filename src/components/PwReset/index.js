import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext, withAuthorization } from '../Session';

// --- Components --- //
import { Row, Form, Icon, Input, Button } from 'antd';

// --- Styles --- //
import '../../styles/_session_forms.scss';


const PasswordResetPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
     <Row type="flex" justify="center" align="middle" className='form-page'>
        <Row type="flex" justify="center" align="middle" className='form-header'>
          <h1>Change Your Password</h1>
        </Row>
        <PasswordResetForm />
      </Row>
    )}
  </AuthUserContext.Consumer>
);

const INITIAL_STATE = {
  password: '',
  pwConfirm: '',
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
    const { password, pwConfirm, error } = this.state;

    const isInvalid =
      password !== pwConfirm || pwConfirm === '';

    return (
      <Form onSubmit={this.onSubmit} className="account-form">
    
        <Form.Item>
          <Input 
            name="password"
            value={password}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={this.onChange}
            type="password"
            placeholder="New Password"
          />
        </Form.Item>
      
        <Form.Item>
          <Input 
            name="pwConfirm"
            value={pwConfirm}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={this.onChange}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Item>
      
        <Row type="flex" justify="center" align="middle" className='session-btn-container'>
          <Button type="primary" htmlType="submit" className="login-form-button" disabled={isInvalid}>
            Reset My Password
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