import React from 'react';

import { Row } from 'antd';

// --- Styles --- //
import '../../styles/_landing.scss';

function Landing() {
  return (
    <Row type="flex" justify="center" align="middle" className='page-container'>
      
      <Row type="flex" justify="center" align="middle" className="greeting">
        <h1>Welcome to GCDB-API</h1>
        <h3>A Golf Course DB created for the people, by the people.</h3>
      </Row>

      <Row type="flex" justify="center" align="middle" className="intro">
        <p>
          A platform specifically designed to simplify the process
          of creating and editing golf course data that is accessible to all.
        </p>
      </Row>
      
    </Row>
  );
}

export default Landing;