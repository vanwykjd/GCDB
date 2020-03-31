import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

// --- Components --- //
import { Row, Col, Button, Icon, Alert } from 'antd';
import  LogOutButton  from '../Logout';
import ClubList from './ClubList';


// --- Styles --- //
import '../../styles/_sider.scss';


const SideMenuButton = () => {
  const toggleMenu = () => {
    let menu_div = document.getElementById('side-nav-container');
    menu_div.classList.toggle('visible');
  }
  return (
    <Button onClick={toggleMenu} shape='circle' icon='user' size='large' />
  );
}          


const INITIAL_STATE = {
  clubs: null,
  error: false,
  loading: false,
};


class UserSideMenu extends Component {
  constructor(props) {
    super(props);
    
    this.state = { ...INITIAL_STATE};
  }
  
  componentDidMount() {
    this.onListenForUserClubs();
  }
  
  
  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
    this.props.firebase.userClubs(this.props.user.user_id).off();
  }
  
  
  onListenForUserClubs = () => {
    this.setState({ loading: true });
    this.props.firebase.userClubs(this.props.user.user_id)
      .on('value', snapshot => {
        const clubs = snapshot.val();
      
        if (clubs) {
          this.props.setUserClubs(clubs);
          this.setState({ clubs, loading: false });
        } else {
          this.setState({ clubs: null, loading: false });
        }
      }, error => {
        this.setState({ clubs: null, error, loading: false });
      });
  };
  
  
  closeMenu = () => {
    let menu_div = document.getElementById('side-nav-container');
    menu_div.classList.toggle('visible');
  };
  
  
  goTo = (route) => {
    this.props.history.replace({
      pathname: route
    })
  };
  

  render() {
    const {
      clubs,
      loading,
      error,
    } = this.state;
    
    
    return (
      <div id='side-nav-container'>
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
        <div className='side-nav'>
          <div className='side-nav-mask' onClick={this.closeMenu}></div>

          <div className='side-nav-content-wrapper' onClick={() => {this.closeMenu()}}>
            <div className='side-nav-content'>
              <div className='side-nav-wrapper-body'>
                
                <div className='side-nav-header'>
                  <Row type="flex" justify="space-between" align="middle">
                    <Col className='desc'>
                      Clubs
                    </Col>
                    <Col className='action'>
                      <Button type="primary" icon='plus' onClick={() => { this.goTo(ROUTES.CREATE_CLUB) }}>
                        New
                     </Button>
                    </Col>
                  </Row>
                </div>

                <div className='side-nav-body'>
                  { clubs && 
                    <ClubList user={this.props.user} clubs={clubs} goTo={this.goTo} />
                  }
                </div>

                <div className='side-nav-footer'>
                  <LogOutButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const SideMenu = compose(
  withRouter,
  withFirebase,
)(UserSideMenu);


export default SideMenu;

export { UserSideMenu, SideMenuButton };