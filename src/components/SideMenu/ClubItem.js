import React from 'react';

// --- Components --- //
import { Button } from 'antd';


const capitalize = (text) => {
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


const ClubItem = ({club}) => (
  <Button className='side-nav-btn' type='link'>
    {capitalize(club.club_name)}
  </Button>
);


export default ClubItem;
