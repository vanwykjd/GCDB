import React, { Component } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

// --- Components --- //
import { Row, Alert, Icon } from 'antd';
import Club from '../Club';
import SearchBar from '../Search';
import CreateClubPage from '../Club/Create';

// --- Styles --- //
import '../../styles/_club.scss';

const INITIAL_STATE = {
  clubs: null,
  error: false,
  loading: false,
};


class ClubsBase extends Component {
  constructor(props) {
    super(props);
    
    this.state = { ...INITIAL_STATE };
  }

  
  componentDidMount() {
    this.onListenForClubs();
  };
  
  
  onListenForClubs = () => {
    this.setState({ loading: true });
    
    this.props.firebase.clubs()
      .on('value', snapshot => {
        const clubs = snapshot.val();
        this.props.setDbClubs(clubs);
        this.setState({ clubs, loading: false });
      }, error => {
        this.setState({ error, loading: false });
      });
  };
  
  
  componentWillUnmount() {
    this.props.firebase.clubs().off();
    this.setState({
      clubs: null,
      error: false,
      loading: false
    });
  };
  

  createClub = (club) => {
    this.setState({ loading: true });
    const time = Date.now();

    const new_club_id = this.props.firebase.db.ref().child('clubs').push().key;

    let updates = {};
    
    club.meta_data = {
      created_by: this.props.user.user_id,
      created_at: time,
      updated_at: time,
      updated_by: this.props.user.user_id,
      status: 'add-course',
    };

    updates['/clubs/' + new_club_id ] = club;
    updates['/users/' + this.props.user.user_id + /clubs/ + new_club_id ] = club;
    updates['/locations/' + club.country + '/' + club.state + '/' + club.zip + '/' + club.address ] = new_club_id;

    this.props.firebase.db.ref().update(updates)
      .then(() => {
        this.setState({ loading: false });
        this.props.history.push(`/clubs/${new_club_id}`);
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };
  
  
  updateClub = (club_id, club, with_new_location) => {
    this.setState({ loading: true });
    const time = Date.now();

    let updates = {};

    updates['/users/' + this.props.user.user_id + /clubs/ + club_id ] = { ...club }
    updates['/clubs/' + club_id ] = { ...club }
    
    club.meta_data = {
      created_by: this.state.clubs[club_id].meta_data.created_by,
      created_at: this.state.clubs[club_id].meta_data.created_at,
      updated_at: time,
      updated_by: this.props.user.user_id,
      status: this.state.clubs[club_id].meta_data.status,
    }
    
    if (with_new_location) {
      updates['/locations/' + club.country + '/' + club.state + '/' + club.zip + '/' + club.address ] = club_id;
    } 

    this.props.firebase.db.ref().update(updates)
      .then(() => {
        this.setState({ loading: false })
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };
  

  render() {
    const { clubs, error, loading } = this.state;
    
    
    return (
      <Row type="flex" justify="center" align="top" className='clubs'>
        { loading && 
          <div className='loading-page'>
            <Row type="flex" justify="center" align="top" className='loading-container'>
              <Icon type="loading" />
            </Row>
          </div> 
        }
        
        { error && 
          <Row type="flex" justify="center" align="top" className='error-modal'>
            <Alert
              message={error.message}
              type="error"
              closable
            />
          </Row>
        }
      
        <Switch>
          <Route exact path='/'>
            <SearchBar clubs={clubs} />
          </Route>

          <Route exact path={ROUTES.CREATE_CLUB}>
            <CreateClubPage
              user={this.props.user}
              clubs={clubs}
              createClub={this.createClub}
            />
          </Route>

          <Route exact path={ROUTES.CLUB}>
            <Club 
              user={this.props.user}
              clubs={clubs}
              updateClub={this.updateClub}
            />
          </Route>
        </Switch>
    
      </Row>
    );
  }
}


const Clubs = compose(
  withRouter,
  withFirebase,
)(ClubsBase);

export default Clubs;