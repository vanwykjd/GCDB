import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

// --- Components --- //
import Landing from '../Landing';

// --- Styles --- //
import '../../styles/_app.scss';

function App() {
  return (
    <Router>
      <div className='App'>
        <Route exact path={ROUTES.LANDING} component={Landing} />
      </div>
    </Router>
  );
}

export default App;