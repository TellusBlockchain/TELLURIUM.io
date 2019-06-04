import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from './components/Header';

import PagesWelcome from './routes/Pages/PagesWelcome';
import UsersNew from './routes/Users/UsersNew';
import RegistryEntitiesNew from './routes/RegistryEntities/RegistryEntitiesNew';

class App extends React.Component {
  render () {
    return (
      <div className="App">
        <Router>
          <Header />
          <div>
            <Route path="/" exact component={PagesWelcome} />
            <Route path="/users/new" component={UsersNew} />
            <Route path="/registry_entities/new" component={RegistryEntitiesNew} />
          </div>
        </Router>
      </div>
    )
  }
}

export default App;