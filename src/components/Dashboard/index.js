import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthUserContext } from '../Session';

// --- Components --- //
import { Row, Alert, Icon } from 'antd';
import Clubs from '../Clubs';
import SideMenu from '../SideMenu';

// --- Styles --- //
import '../../styles/_dashboard.scss';

const DashboardPage = ({ authUser }) => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? <Dashboard user={{user_id: authUser.uid, clubs: authUser.clubs, username: authUser.username }} /> : <Redirect to='/login' />
    }
  </AuthUserContext.Consumer>
);
                               
const INITIAL_STATE = {
  db_clubs: null,
  user_clubs: null,
  loading: false,
  error: false
};

                               
class Dashboard extends Component {
  constructor(props) {
    super(props);
    
    this.state = { ...INITIAL_STATE };
  }
  

  setDbClubs = (clubs) => {
    this.setState({ db_clubs: clubs });
  }
  
  
  setUserClubs = (clubs) => {
    this.setState({ user_clubs: clubs });
  }
  

  render() {
    const {
      db_clubs,
      user_clubs,
      error,
      loading,
    } = this.state;
  
    
    return (
      <Row type="flex" justify="center" align="middle" className="page-container">
        { loading && 
          <div className='loading-page'>
            <Row type="flex" justify="center" align="middle" className='loading-container'>
              <Icon type="loading" />
            </Row>
          </div> 
        }

        { this.props.user && 
          <Row type="flex" justify="center" align="top" className="dashboard" id='dashboard'>
            { error && 
              <Row type="flex" justify="center" align="middle" className='error-modal'>
                <Alert
                  message={error.message}
                  type="error"
                  closable
                />
              </Row>
            }
           
            <Row type="flex" justify="center" align="top" style={{ width: '100%'}}>
              <SideMenu 
                user={this.props.user}
                setUserClubs={this.setUserClubs}
              />

              <Clubs
                user={this.props.user}
                db_clubs={db_clubs}
                user_clubs={user_clubs}
                setDbClubs={this.setDbClubs} 
              />
            </Row>
          </Row>
        }
       
      </Row>
    );
  }
}


export default DashboardPage;