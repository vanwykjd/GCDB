import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { COUNTRIES, STATES_REGIONS } from '../../geo_location';

// --- Components --- //
import { Row, Col, Input, Select, Button, Alert, Icon, Popconfirm } from 'antd';

const { Option } = Select;

const CLUB_TYPES = { public: 'Public', private: 'Private' };
const MEASUREMENTS = { us: 'yards', ca: 'meters', other: 'meters' };

const INITIAL_STATE = {
  prev_club: null,
  club_name: null,
  address: null,
  city: null,
  state: null,
  zip: null,
  country: null,
  type: null,
  measurement: null,
  edited: false,
  error: false,
  loading: false,
};


class Edit extends Component {
  constructor(props) {
    super(props);
    
    this.state = { ...INITIAL_STATE };
  }
  
  
  componentDidMount() {
    this.setState({
      prev_club: this.props.club,
      club_name: this.capitalize(this.props.club.club_name),
      address: this.capitalize(this.props.club.address),
      city: this.capitalize(this.props.club.city),
      state: this.props.club.state,
      zip: Number(this.props.club.zip),
      country: this.props.club.country,
      type: this.props.club.type,
      measurement: this.props.club.measurment,
      edited: false,
      error: false,
      loading: false,
      mounted: true,
    });
  }
  
  
  componentWillUnmount() {
    this.props.firebase.location().off();
  }
  
  
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  };
  
  
  onBlurText = (e) => {
    if (e.target.value) {
      this.setState({ [e.target.name]: this.capitalize(e.target.value), error: false  });
    }
  };
  
  
  handleSelect = (value, data) => {
    this.setState({ [data.ref]: value, edited: true, error: false });
  };
  
  
  verifyLocation = (updated_club) => {
    this.props.firebase
      .location(updated_club.country, updated_club.state, updated_club.zip, updated_club.address)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          const club_returned = this.props.clubs[snapshot.val()];
          
          const error = {
            message: `${club_returned.club_name.toUpperCase()}, has already been created for this location.`,
            returned_club_id: snapshot.val(),
          };
          
          this.setState({ error: error, loading: false });
        } else {
          this.removeLocation(updated_club);
        }
    })
  };

  
  removeLocation = (updated_club) => {
    this.props.firebase
      .locationToRemove(this.props.club.country, this.props.club.state, this.props.club.zip, this.props.club.zip)
      .child(this.props.club.address).remove()
      .then(() => {
        this.updateClub(updated_club, true)
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  
  updateClub = (updated_club, with_new_location) => {
    let club = this.props.club;
    
    for ( const key of Object.keys(updated_club) ) {
      club[key] = updated_club[key];
    }
    
    this.setState({ ...INITIAL_STATE });
    this.props.updateClub(club, with_new_location);
  };
  
  
  cancelEdit = () => {
    this.clearForm();
  };
  
  
  clearForm = () => {
    this.setState({ 
      club_name: null,
      address: null,
      city: null,
      state: null,
      zip: null,
      country: null,
      measurement: null,
      type: null,
      error: false,
      loading: false,
    });
    this.props.toggleEdit();
  };
  
  
  handleSubmit = (e) => {
    let updated_club = {
      club_name: this.state.club_name.toLowerCase().replace(/[^a-zA-Z\d\s&]/g, '').trim(),
      type: this.state.type,
      address: this.state.address.toLowerCase().replace(/[^a-zA-Z\d\s]/g, '').trim(),
      city: this.state.city.toLowerCase().replace(/[^a-zA-Z\d\s]/g, '').trim(),
      state: this.state.state,
      zip: Number(this.state.zip),
      country: this.state.country,
      measurement: MEASUREMENTS[this.state.country]
    };
      
    if (this.state.prev_club.courses) {
      updated_club.courses = this.state.prev_club.courses;
    } else if (this.state.prev_club.num_of_holes) {
      updated_club.num_of_holes = this.state.prev_club.num_of_holes;
    }

    let address_change = (updated_club.address !== this.props.club.address) 
      || (updated_club.state !== this.props.club.state)
      || (updated_club.city !== this.props.club.city)
      || (updated_club.zip !== this.props.club.zip)
      || (updated_club.country !== this.props.club.country);

    if (address_change) {
      this.verifyLocation(updated_club);
    } else {
      this.updateClub(updated_club, false);
    }
    e.preventDefault();
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
  

  render() {
    const { club_name, address, city, state, zip, country, type, loading, error, prev_club } = this.state;
    let isEdited = {};
    let invalid_zip = false;
    
    if (this.state.prev_club) {
      isEdited = {
        club_name: (club_name.toLowerCase().replace(/[^a-zA-Z\d\s&]/g, '').trim() !== this.props.club.club_name),
        type: (type !== this.props.club.type),
        address: (address.toLowerCase().replace(/[^a-zA-Z\d\s]/g, '').trim() !== this.props.club.address),
        city: (city.toLowerCase().replace(/[^a-zA-Z\d\s]/g, '').trim() !== this.props.club.city),
        state: state !== this.props.club.state,
        zip: Number(zip) !== Number(this.props.club.zip),
        country: (country !== this.props.club.country),
      }

      invalid_zip = (zip.toString().length !== 5);
    };

    const current_data = {
      club_name: club_name,
      type: type,
      address: address,
      city: city,
      state: state,
      zip: zip,
      country: country,
    };

    const invalidClubData = ( Object.values(current_data).includes(null) || Object.values(current_data).includes('') || !Object.values(isEdited).includes(true));
    const isInvalid = invalidClubData || error || (invalid_zip);

    
    return (      
      <Row type="flex" justify="center" align="middle" className='session-form'>
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
      
        <Row type="flex" justify="center" align="middle" className='form-header'>
          <h2>Edit Club</h2>
        </Row>
        { prev_club && 
          <Row type="flex" justify="center" align="top" className='form-container'>
            <Row type="flex" justify="center" align="middle" className='form-input'>
              <div className='input-lable'>
                Club Name:
              </div>

              <Input
                name="club_name"
                value={club_name}
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
                value={CLUB_TYPES[type]}
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
                    value={STATES_REGIONS[country][state]}
                    onChange={this.handleSelect}
                    onBlur={this.onBlurSelect}
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
                name='country'
                showSearch
                style={{ width: '100%' }}
                value={COUNTRIES[country]}
                onChange={this.handleSelect}
                onBlur={this.onBlurSelect}
              >
                { Object.keys(COUNTRIES).map ( country => <Option ref='country' key={country} > {COUNTRIES[country]} </Option>) }
              </Select>
            </Row>


            <Row type="flex" justify="center" align="middle" className='session-btn-container'>
              <Button type="primary" onClick={this.handleSubmit} className="login-form-button" disabled={isInvalid}>
                Update
              </Button>
              { (Object.values(isEdited).includes(true)) ? (
                <Popconfirm title="Discard changes？" okText="Yes" cancelText="No" onConfirm={this.cancelEdit}>
                  <Button type="link" onClick={this.showEdits}>
                    Cancle
                  </Button>
                </Popconfirm>
              ) : (
                <Button type="link" onClick={this.cancelEdit} >
                  Cancle
                </Button>
              )}
            </Row>
          </Row>
        }

      </Row>
    );
  }
}


const EditClub = compose(
  withRouter,
  withFirebase,
)(Edit);

export default EditClub;