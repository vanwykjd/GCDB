import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// --- Components --- //
import { Menu } from 'antd';
import ClubItem from './ClubItem';


const INITIAL_STATE = {
  clubs_completed: null,
  clubs_in_progress: null,
};

class ClubList extends Component {
  constructor(props) {
    super(props);
    
    this.state = { ...INITIAL_STATE };
  }
  
  
  componentDidMount() {
    this.getClubLists();
    this.getActiveClub();
  }
  
  
  getClubLists = () => {
    let clubs_completed = null;
    let clubs_in_progress = null;
    
    for (const club_id of Object.keys(this.props.clubs) ) {
      let club = this.props.clubs[club_id];
      
      if (club.meta_data.status === 'completed') {
        clubs_completed = (clubs_completed) 
          ? [...clubs_completed, {club_id: club_id, route: `/clubs/${club_id}`, ...club }]
          : [{club_id: club_id, route: `/clubs/${club_id}`, ...club }];
      } else {
        clubs_in_progress = (clubs_in_progress) 
          ? [...clubs_in_progress, {club_id: club_id, route: `/clubs/${club_id}`, ...club }]
          : [{club_id: club_id, route: `/clubs/${club_id}`, ...club }];
      }
    }
    
    this.setState({ clubs_completed, clubs_in_progress });
  }
  
  
  getActiveClub = () => {
    let current_location = this.props.location.pathname.split('/');
    
    if (current_location[1] === 'clubs') {
      return current_location[2];
    }
  };
  
  
  componentDidUpdate(prevProps, prevState) {
    if (this.props.clubs !== prevProps.clubs) {
      this.getClubLists();
    }
  }
  
  
  render() {
    const { clubs_completed, clubs_in_progress } = this.state;
    
    let active_club = this.getActiveClub();
    
    
    return (
      <Menu mode="inline" selectedKeys={[active_club]}>
        {clubs_completed && clubs_completed.map( club => (
          <Menu.Item key={club.club_id} className='club-item' onClick={() => { this.props.goTo(club.route)}}>
            <ClubItem club={club} user={this.props.user} />
          </Menu.Item>
        ))}

        { clubs_in_progress && (
          <Menu.ItemGroup title="In Progress">
            { clubs_in_progress.map( club => (
            <Menu.Item key={club.club_id} className='club-item' onClick={() => { this.props.goTo(club.route)}}>
                <ClubItem club={club} user={this.props.user} goTo={this.props.goTo}/>
              </Menu.Item>
            ))}
          </Menu.ItemGroup>
        )}
      </Menu>
    );
  }
}

export default withRouter(ClubList);