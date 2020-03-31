import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { COUNTRIES, STATES_REGIONS } from '../../geo_location';

// --- Components --- //
import { Row, Col, Input, Select, Button, Alert, Icon } from 'antd';

const { Option } = Select;

const CLUB_TYPES = { public: 'Public', private: 'Private' };
const MEASUREMENTS = { us: 'yards', ca: 'meters', other: 'meters' };

const INITIAL_STATE = {
    club_name: null,
    address: null,
    city: null,
    state: null,
    zip: null,
    country: 'us',
    type: null,
    error: false,
    loading: false,
};


class CreateClub extends Component {
  constructor(props) {
    super(props);
    
    this.state = { ...INITIAL_STATE };
  }
  

  componentDidMount() {
    console.log('<<<< CREATE CLUB PAGE MOUNTED <<<<');
  }
  
  
  componentWillUnmount() {
    console.log('>>>> CREATE CLUB PAGE UNMOUNTED >>>>');
    this.props.firebase.locations().off();
    this.setState({ ...INITIAL_STATE });
  }
  
  
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, edited: true });
  };
  
  
  onBlurText = (e) => {
    if (e.target.value) {
      this.setState({ [e.target.name]: this.capitalize(e.target.value), error: false  });
    }
  };
  

  handleSelect = (value, data) => {
    this.setState({ [data.ref]: value, edited: true, error: false });
  };
  

  verifyLocation = (club) => {
    this.props.firebase
      .location(club.country, club.state, club.zip, club.address)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          const club_returned = this.props.clubs[snapshot.val()];
          let error;
          
          if (club_returned.club_name === club.club_name) {
            error = {
              message: `${this.capitalize(club_returned.club_name)}, has already been created.`,
              returned_club_id: snapshot.val(),
            };
          } else {
            error = {
              message: `${this.capitalize(club_returned.club_name)}, has already been created for this location.`,
              returned_club_id: snapshot.val(),
            };
          } 
          this.setState({ loading: false, error: error, edited: false });
        } else {
          this.createClub(club);
        }
    })
  };
  
  
  createClub = (club) => {
    this.setState({ ...INITIAL_STATE });
    this.props.createClub(club);
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
  
  
  handleSubmit = (e) => {
    const new_club = {
      address: this.state.address.toLowerCase().replace(/[^a-zA-Z\d\s]/g, '').trim(),
      city: this.state.city.toLowerCase().replace(/[^a-zA-Z\d\s]/g, '').trim(),
      club_name: this.state.club_name.toLowerCase().replace(/[^a-zA-Z\d\s&]/g, '').trim(),
      country: this.state.country,
      measurement: MEASUREMENTS[this.state.country],
      state: this.state.state,
      type: this.state.type,
      zip: Number(this.state.zip),
    }
    
    this.verifyLocation(new_club);

    e.preventDefault();
  };
  
  
  render() {
    const { club_name, address, city, state, zip, country, type, loading, error } = this.state;
    
    const club_data = {
      club_name: club_name,
      type: type,
      address: address,
      city: city,
      state: state,
      zip: zip,
      country: country,
    }
    
    const invalidClubData = ( Object.values(club_data).includes(null) || Object.values(club_data).includes('') );
    const isInvalid = invalidClubData || error;

    
    return (
      <Row type="flex" justify="center" align="middle" className='session-form'>
        <Row type="flex" justify="center" align="middle" className='form-header'>
          <h2>New Club</h2>
        </Row>
      
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
        
        <Row type="flex" justify="center" align="top" className='form-container'>
          <Row type="flex" justify="center" align="middle" className='form-input'>
            <div className='input-lable'>
              Club Name:
            </div>
      
            <Input
              name="club_name"
              value={club_name}
              placeholder="Enter Club Name"
              onChange={this.handleChange}
              onBlur={this.onBlurText}
            />
          </Row>
      
          <Row type="flex" justify="center" align="middle" className='form-input'>
            <div className='input-lable'>
              Club Type:
            </div>
    
            <Select
              style={{ width: '100%' }}
              placeholder="Select Type"
              onChange={this.handleSelect}
              onBlur={this.onBlurSelect}
            >
              { Object.keys(CLUB_TYPES).map ( type => <Option ref='type' key={type} > {CLUB_TYPES[type]} </Option>) }
            </Select>
          </Row>

          <Row type="flex" justify="center" align="middle" className='form-input'>
            <div className='input-lable'>
              Street Address:
            </div>

            <Input
              name="address"
              value={address}
              placeholder="Enter Street Address"
              onChange={this.handleChange}
              onBlur={this.onBlurText}
            />
          </Row>

          <Row type="flex" justify="center" align="middle" className='form-input'>
            <div className='input-lable'>
              City:
            </div>

            <Input
              name="city"
              value={city}
              placeholder="Enter City"
              onChange={this.handleChange}
              onBlur={this.onBlurText}
            />
          </Row>

          <Row type="flex" justify="space-between" align="middle" style={{ width: '100%' }}>
            <Col xs={24} sm={10}>
              <Row type="flex" justify="space-between" align="middle" className='form-input'>
                <div className='input-lable'>
                  State:
                </div>

                <Select
                  name='state'
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Select State"
                  onChange={this.handleSelect}
                >
                  { Object.keys(STATES_REGIONS[country]).map ( state => <Option ref='state' key={state} > {STATES_REGIONS[country][state]} </Option>) }
                </Select>
              </Row>
            </Col>

            <Col xs={24} sm={10}>
              <Row type="flex" justify="space-between" align="middle" className='form-input'>
                <div className='input-lable'>
                  Zip:
                </div>

                <Input
                  name="zip"
                  value={zip}
                  placeholder="Enter Zip"
                  onChange={this.handleChange}
                  onBlur={this.onBlurText}
                />
              </Row>
            </Col>
          </Row>

          <Row type="flex" justify="center" align="middle" className='form-input'>
            <div className='input-lable'>
              Country:
            </div>

            <Select
              showSearch
              defaultValue="us"
              style={{ width: '100%' }}
              placeholder="Select Country"
              onChange={this.handleSelect}
            >
              { Object.keys(COUNTRIES).map ( country => <Option ref='country' key={country} > {COUNTRIES[country]} </Option>) }
            </Select>
          </Row>

          <Row type="flex" justify="center" align="middle" className='session-btn-container'>
            <Button type="primary" onClick={this.handleSubmit} className="login-form-button" disabled={isInvalid}>
              Create Club
            </Button>
          </Row>
        </Row>
      </Row>
    );
  }
}


const CreateClubPage = compose(
  withRouter,
  withFirebase,
)(CreateClub);

export default (CreateClubPage);