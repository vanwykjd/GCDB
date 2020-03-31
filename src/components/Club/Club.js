import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

// --- Components --- //
import { Row, Alert } from 'antd';
import Delete from './Delete';
import ClubCard from './Card';
import Edit from './Edit';

// --- Styles --- //
import '../../styles/_club.scss';

const INITIAL_STATE = {
  isEditing: false,
  isDeleting: false,
  club_id: null,
  club: null,
  error: null,
};


class Club extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }
  

  componentDidMount() {
    if (this.props.clubs) {
      this.setClub();
    }
  }
  
  
  setClub = () => {
    const club_id = this.props.match.params.club_id;
    let club = this.props.clubs[club_id];
    this.setState({ club_id, club });
  };
  
  
  componentWillUnmount() {
    this.setState({ ...INITIAL_STATE });
  }
  
  
  toggleEdit = () => {
    let isEditing = !this.state.isEditing;
    this.setState({ isEditing });
  };
  
  
  toggleDelete = () => {
    let isDeleting = !this.state.isDeleting;
    this.setState({ isDeleting });
  };
  
  
  updateClub = (club, with_new_location) => {
    this.props.updateClub(this.props.match.params.club_id, club, with_new_location);
    this.setState({ isEditing: false });
  };
  
  
  deleteClub = () => {
    this.setState({ ...INITIAL_STATE });
    this.props.history.push({ pathname: ROUTES.LANDING });
  };
  
  
  componentDidUpdate(prevProps, prevState) {
    let new_location = (this.props.match.params.club_id !== prevProps.match.params.club_id);
    let updated_club = (((this.props.clubs) && (this.props.clubs[this.props.match.params.club_id])) !== this.state.club)
    
    if (new_location || (updated_club && !prevState.isDeleting)) {
      this.setClub();
    }
  };

  
  render() {
    const { club, club_id, isEditing, isDeleting, error } = this.state;

      
    return (
      <Row type="flex" justify="center" align="top" className='club-section'>

        { error && 
          <Row type="flex" justify="center" align="top" className='error-modal'>
            <Alert
              message={error.message}
              description={`Changes made: ${error.changes}`}
              type="error"
              closable
            />
          </Row>
        }
      
        { club && 
          <Row type="flex" justify="center" align="top" className='club-page'>
            { isEditing ? (
              <Edit 
                user={this.props.user}
                clubs={this.props.clubs}
                club_id={club_id}
                club={club}
                toggleEdit={this.toggleEdit}
                updateClub={this.updateClub} 
              />
            ) : (
              <div>
                { isDeleting && 
                  <Delete
                    user={this.props.user}
                    club_id={club_id}
                    club={club}
                    toggleDelete={this.toggleDelete}
                    deleteClub={this.deleteClub}
                  />
                }
                <ClubCard
                  user={this.props.user}
                  club_id={club_id}
                  club={club}
                  toggleEdit={this.toggleEdit}
                  toggleDelete={this.toggleDelete}
                />
              </div>
            )}
          </Row>
        }
      </Row>
    );
  }
}

export default withRouter(Club);