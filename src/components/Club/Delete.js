import React, { Component } from 'react';
import { withFirebase } from '../Firebase';

// --- Components --- //
import { Row, Alert, Icon, Button, Modal, Input } from 'antd';

const INITIAL_STATE = { 
  club_confirm: null,
  error: false,
  loading: false,
};


class Delete extends Component {
  constructor(props) {
    super(props);
    
    this.state = ({ ...INITIAL_STATE });
  }
  
  
  componentWillUnmount() {
    this.props.firebase.club(this.props.club_id).off();
    this.props.firebase.userClub(this.props.user.user_id, this.props.club_id).off();
    this.props.firebase.deletedClubs(this.props.club_id).off();
    this.props.firebase.locations().off();
  }
  
  
  removeClub = () => {
    console.log('*** DELETING CLUB ***');
    this.props.firebase
      .clubs()
      .child(this.props.club_id)
      .remove()
      .then(() => {
        console.log('*** CLUB DELETED ***');
        this.setState({ ...INITIAL_STATE });
        this.props.deleteClub();
      })
      .catch(error => {
        console.log('----- ERROR: DELETING CLUB: ', error);
        this.setState({ error, loading: false });
      });
  };
  
    
  removeUserClub = () => {
    console.log('*** DELETING USER CREATED CLUB ***');
    this.props.firebase
      .userClubs(this.props.user.user_id)
      .child(this.props.club_id)
      .remove()
      .then(() => {
        console.log('___ USER CREATED CLUB DELETED ___')
        this.removeClub();
      })
      .catch(error => {
        console.log('----- ERROR: DELETING USER CREATED CLUB: ', error);
        this.setState({ error, loading: false });
      });
  };
  

  addDeletedClub = () => {
    const time = Date.now();
    let deleted_club = this.props.club;
    
    deleted_club.meta_data.deleted_at = time;
    deleted_club.meta_data.deleted_by = this.props.user.user_id;

    this.props.firebase
      .deletedClubs(this.props.club_id)
      .set({ ...deleted_club })
      .then(() => {
        this.removeUserClub();
      })
      .catch(error => {
        console.log('----- ERROR: CREATE DELETED CLUB: ', error);
        this.setState({ error, loading: false });
      });
  };
  
  
  removeLocation = () => {
    this.props.firebase
      .locationToRemove(this.props.club.country, this.props.club.state, this.props.club.zip, this.props.club.zip)
      .child(this.props.club.address).remove()
      .then(() => {
        this.addDeletedClub()
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };
  
  
  deleteClub = () => {
    this.setState({ loading: true });
    this.removeLocation();
  };
  
  
  capitalize = (text) => {
    if (text) {
      let str_arr = text.split(' ');
      let formatted_arr = [];
      
      for ( let word of str_arr) {
       formatted_arr.push(word.replace(/^\w/, c => c.toUpperCase()));
      }
      
      let formatted_str = formatted_arr.join(' ');
      return formatted_str;
    }
  };
  
  
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  
  
  render() {
    const {
      club_confirm,
      error,
      loading
    } = this.state;

    const isInvalid = (this.capitalize(this.props.club.club_name) !== this.capitalize(club_confirm));
    
    
    return (
      <div className='delete-action'>
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
    
        <Modal
          title={[<Icon type="exclamation-circle" style={{ marginRight: '16px', color: 'red'}}/>, <span>Are you sure you want to delete this club?</span>]}
          visible={true}
          onOk={this.deleteClub}
          onCancel={this.props.toggleDelete}
          maskClosable={false}
          footer={[
            <Button
              key="delete"
              type="danger"  onClick={this.deleteClub} 
              disabled={isInvalid} style={{ width: '100%'}}>
              I am sure, delete this club
            </Button>
          ]}
        >
           <Row type="flex" justify="start" align="middle" style={{ width: '100%' }}>
            <p>This will delete the club and course(s) associated.</p>
            <p>Please enter <b>{this.capitalize(this.props.club.club_name)}</b> to confirm you are wanting to delete</p>

            <Input
              name="club_confirm"
              placeholder="Enter Club Name"
              onChange={this.handleChange}
            />

          </Row>
        </Modal>

      </div>
    );
  }
}

export default withFirebase(Delete);