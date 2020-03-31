
import React from 'react';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

// --- Components --- //
import { Button } from 'antd';


const LogOutButton = ({ firebase }) => (
    <Link className='nav-item' to={ROUTES.LANDING}>
      <Button onClick={firebase.doSignOut} style={{ width: '100%'}}>
        Sign Out 
      </Button>
    </Link>
);

export default withFirebase(LogOutButton);