import React from 'react';

// --- Components --- //
import { Row, Col, Icon, Menu, Dropdown, Button, Popover } from 'antd';


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
}


const formattedDate = (date) => {
  let new_date = new Date(date);
  
  let day = new_date.getDate();
  let month = new_date.getMonth(); 
  let year = new_date.getFullYear();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const date_string = `${months[month]}  ${day}, ${year}`;
  
  return date_string;
}


const ActionsMenu = ({club, actions}) => (
  <Menu className='club-dropdown' selectedKeys={[]}>
    { (club.meta_data.status === 'complete') ? (
      <Menu.Item key="edit-club" className='dropdown-item'>
        <Button type="link" style={{ width: '100%' }} onClick={actions.edit}>
          Edit
        </Button>
      </Menu.Item>
     ) : (
      <Menu.Item key="edit-club" className='dropdown-item'>
        <Button type="link" style={{ width: '100%' }} onClick={actions.edit}>
          Continue
        </Button>
      </Menu.Item>
    )}

    <Menu.Divider />

    <Menu.Item key="delete-club" className='dropdown-item'>
      <Button type="link" onClick={actions.delete} style={{ width: '100%' }} danger='true'>
        Delete
      </Button>
    </Menu.Item>
  </Menu>
);


const ActionsDropdown = ({ user, club, actions }) => (
  <>
  { (club.meta_data.created_by === user.user_id) && 
    <Dropdown overlay={<ActionsMenu club={club} actions={actions} />} trigger={['click']} icon='down' placement="bottomRight">
      <Button type='link' onClick={e => e.preventDefault()}>
        <Icon type='ellipsis' />
      </Button>
    </Dropdown>
  }
  </>
);


const MetaDataContent = ({club}) => (
  <>
    <Row type="flex" justify="start" align="middle">
      <Col style={{ paddingRight: '4px'}}>
        Created at:
      </Col>
      <Col style={{ padingLeft: '4px'}}>
        {formattedDate(club.meta_data.created_at)}
      </Col>
    </Row>

    <Row type="flex" justify="start" align="middle">
      <Col style={{ paddingRight: '4px'}}>
        Updated at:
      </Col>
      <Col style={{ padingLeft: '4px'}}>
        {formattedDate(club.meta_data.updated_at)}
      </Col>
    </Row>
  </>
);


const MetaDataPopover = ({club}) => (
  <Popover
    placement="bottomRight"
    title={(club.meta_data.status === 'complete') ? false : (<div style={{color: 'rgba(255, 0, 0, 0.75)', width: '100%', textAlign: 'center'}}>This club is incomplete</div>)}
    content={<MetaDataContent club={club} />} 
    trigger="focus">
      {(club.meta_data.status === 'complete') ? (
        <Button type='link' icon={'info-circle'}  />
      ) : (
        <Button type='link' icon={'exclamation-circle'} className='warning' />
      )}
  </Popover>
);


const MetaData = ({ club }) => (
  <Row type="flex" justify="start" align="middle">
    <Col>Last updated: {formattedDate(club.meta_data.updated_at)}</Col>
    
    <Col className='notification-icon'>
      <MetaDataPopover club={club} />
    </Col>
  </Row>
);


const ClubTaskBar = ({user, club, actions}) => (
  <Row type="flex" justify="space-between" align="middle" className='club-task-bar'>
    <Col>
      <MetaData club={club} user={user} />
    </Col>

    <Col>
      <ActionsDropdown user={user} club={club} actions={actions} />
    </Col>
  </Row>
);


const ClubData = ({ club }) => (
  <Row type="flex" justify="start" align="middle" className='club-banner'>
    <div className='club-name'>
      <h1>{capitalize(club.club_name)}</h1>
    </div>
    <address>
      <span>{capitalize(club.address)}</span>, <span>{capitalize(club.city)}</span>, <span>{club.state.toUpperCase()}</span>, <span>{club.zip}</span>
    </address>
  </Row>
);


const ClubCard = ({user, club, toggleEdit, toggleDelete }) => (
  <Row type="flex" justify="center" align="middle" className={(club.meta_data.status === 'complete') ? 'club-data-container' : 'club-data-container warning'}>
    <ClubTaskBar user={user} club={club} actions={{ edit: toggleEdit, delete: toggleDelete }} />
    <ClubData club={club} />
  </Row>
);



export default ClubCard;