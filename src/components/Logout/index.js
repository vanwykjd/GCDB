
import React from 'react';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';

// --- Components --- //
import { Button } from 'antd';


// --- Styles --- //
import '../../styles/_session_forms.scss';

const LogOutButton = ({ firebase }) => (
  <Button onClick={firebase.doSignOut}>
    <Link className='nav-item'>Sign Out</Link>
  </Button>
);

export default withFirebase(LogOutButton);