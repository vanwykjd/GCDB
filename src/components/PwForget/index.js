import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

// --- Components --- //
import { Form, Icon, Input, Button, Row, Alert } from 'antd';

const PasswordForgetPage = () => ( <PasswordForgetForm /> );

const INITIAL_STATE = {
  email: '',
  error: null,
  loading: false,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    event.preventDefault();
    
    this.setState({ loading: true });
    const { email } = this.state;
    let error = this.state.error;
    
    const invalidEmail = (email) ? email.includes(" ") : true;
    
    if (invalidEmail) {
      error = { message: 'Invalid email.' };
      this.setState({ loading: false, error });
    } else {
      this.props.firebase
        .doPasswordReset(email)
        .then(() => {
          this.setState({ ...INITIAL_STATE });
          this.props.history.push(ROUTES.LOGIN);
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
    }
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error, loading } = this.state;

    const isInvalid = email === '';

    return (
      <Row type="flex" justify="center" align="middle" className='session-form'>
      
        <Row type="flex" justify="center" align="middle" className='form-header'>
          <h1>Reset password</h1>
          <h2>Enter account email address</h2>
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
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              onChange={this.onChange}
              type="text"
              placeholder="Enter email"
            />
          </Row>
      
          <Row type="flex" justify="center" align="middle" className='form-actions-container'>
            <Row type="flex" justify="center" align="middle" className='form-btn-container'>
              <Button type="primary" htmlType="submit" className="create-account-btn" disabled={isInvalid}>
                Send Password Reset Form
              </Button>
            </Row>
          </Row>
        </Form>
      </Row>
    );
  }
}

const PasswordForgetLink = () => (

  <Row type="flex" justify="start" align="middle" className='form_link'>
    <Link to={ROUTES.PW_FORGET}>Forgot password?</Link>
  </Row>

);

const PasswordForgetForm = compose(
  withRouter,
  withFirebase,
)(PasswordForgetFormBase);

export default PasswordForgetPage;
export { PasswordForgetForm, PasswordForgetLink };