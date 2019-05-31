import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Index from './routes/Index';
import Notary from './routes/Notary';

class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Welcome</Link>
              </li>
              <li>
                <Link to="/notary/">Notary</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/notary/" component={Notary} />
        </div>
      </Router>
    )
  }
  
}

export default App;