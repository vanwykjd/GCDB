import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

// --- Components --- //
import { Form, Icon, Input, Button, Row } from 'antd';

// --- Styles --- //
import '../../styles/_session_forms.scss';


const PasswordForgetPage = () => (
  <Row type="flex" justify="center" align="middle" className='form-page'>
    <Row type="flex" justify="center" align="middle" className='form-header'>
      <h1>To Reset Your Password...</h1>
      <h3>Enter the email used to access your account</h3>
    </Row>
    <PasswordForgetForm />
  </Row>
);

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LOGIN);
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
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <Form onSubmit={this.onSubmit} className="account-form">
  
        <Form.Item>
          <Input
            name="email"
            value={email}
            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
            onChange={this.onChange}
            type="text"
            placeholder="Email"
          />
        </Form.Item>
      
        <Row type="flex" justify="center" align="middle" className='session-btn-container'>
          <Button type="primary" htmlType="submit" className="login-form-button" disabled={isInvalid}>
            Send Password Reset Form
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

const PasswordForgetLink = () => (

  <Row type="flex" justify="center" align="middle" className='form_link'>
    <Link to={ROUTES.PW_FORGET}>Forgot Password?</Link>
  </Row>

);

const PasswordForgetForm = compose(
  withRouter,
  withFirebase,
)(PasswordForgetFormBase);

export default PasswordForgetPage;
export { PasswordForgetForm, PasswordForgetLink };