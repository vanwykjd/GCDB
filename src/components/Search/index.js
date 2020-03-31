import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
// --- Components --- //
import { Row, Input, Button, Col } from 'antd';

// --- Styles --- //
import '../../styles/_search.scss';

const { Search } = Input;

let time_delay;

class SearchBar extends Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      search: null,
      search_results: null,
      current_selected: null,
      show_results: false
    };
  }
  
  
  componentWillUnmount() {
    clearTimeout(time_delay);
  }

  
  handleSearch = (e) => {
    let search = e.target.value;
    let search_results = this.state.search_results;
    let current_selected = this.state.current_selected;
    
    if (search) { 
      search_results = [];
      current_selected = null;

      for (const club_id of Object.keys(this.props.clubs)) {
        let club = this.props.clubs[club_id];
        
        const club_name = club.club_name.toLowerCase();

        if (club_name.match(search.toLowerCase())) {
          search_results.push({club_id: club_id, ...club});
        }
      }
      current_selected = search_results[0];
      
      this.setState({ search_results, current_selected, search});
    } else {
      this.setState({ search_results: null, current_selected: null, search});
    }
  }
  

  showResults = () => {
    let status = !this.state.show_results;
    this.setState({ show_results: status });
  }
  
  
  hideResults = () => {
    time_delay = setTimeout(this.showResults, 175);
  }
  
  
  handleSelect = club_id => {
    this.setState({});
    this.props.history.push({
      pathname: `/clubs/${club_id}`
    });
  }
  

  handleEnter = () => {
    let current_selected = this.state.current_selected;
    let search = this.state.search;
    if (current_selected && (search !== null && search.length > 5)) {
      this.setState({});
      this.props.history.push({
        pathname: `/clubs/${current_selected.club_id}`,
      });
    }
  }
  

  capitalize = text => {
    if (text) {
      let str_arr = text.split(' ');
      let formatted_arr = [];
      for ( let word of str_arr) {
       formatted_arr.push(word.replace(/^\w/, c => c.toUpperCase()));
      }
      
      let formatted_str = formatted_arr.join(' ');
      return formatted_str;
    }
  }

  
  render() {
    const {
      search,
      search_results,
      show_results
    } = this.state;

    const validSearchResults = (search_results) ? (search_results.length > 0) : false;
    
    return (
      <Row type="flex" justify="center" align="top" className="search-page">
        <Row type="flex" justify="center" align="bottom" className="search-page-header">
          <h1>GCDB-API</h1>
        </Row>
      
        <Row type="flex" justify="center" align="middle" className="actions-container">
          { this.props.clubs && 
            <Row type="flex" justify="center" align="middle" className="course-search">
              <Search
                placeholder={"Search Course"}
                onFocus={this.showResults}
                onBlur={this.hideResults}
                size='large'
                value={search}
                onSearch={this.handleEnter}
                onChange={this.handleSearch}
              />


              { (validSearchResults && show_results) && 
                <Row type="flex" justify="center" align="middle" className='search-results'>
                  <div className='search-results-conatiner'>
                    { search_results.map( club =>
                      <Row key={club.club_id} type="flex" justify="center" align="middle" className='search-result-wrapper'>
                        <div className="search-result">
                          <Button type='link' onClick={() => { this.handleSelect(club.club_id) }}>
                            
                              <span className='club-name'>
                                {this.capitalize(club.club_name)}
                              </span>
                              <span className='club-desc'>
                                {club.state.toUpperCase()}
                              </span>
                 
                          </Button>
                        </div>
                      </Row>
                    )}
                  </div>
                </Row>
              }
            </Row>
          }

          <Row type="flex" justify="center" align="middle" className="action-btns-container">
            <Col className="btn-container">
              <Link className='action-btn' to={ROUTES.CREATE_CLUB}>
                <Row type="flex" justify="center" align="middle" className="btn-wrapper">
                  <Button shape="circle" icon="plus" />
                  <span>Create New Club</span>
                </Row>
              </Link>
            </Col>
          </Row>

        </Row>
      </Row>
    );
  }
}


export default withRouter(SearchBar);