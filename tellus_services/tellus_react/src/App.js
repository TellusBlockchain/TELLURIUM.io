import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from './components/Header';

import PagesWelcome from './routes/Pages/PagesWelcome';
import UsersNew from './routes/Users/UsersNew';
import RegistryEntitiesNew from './routes/RegistryEntities/RegistryEntitiesNew';
import RegistryEntitiesIndex from './routes/RegistryEntities/RegistryEntitiesIndex';
import PagesExplorer from './routes/Pages/PagesExplorer';

class App extends React.Component {
  render () {
    return (
      <div className="App">
        <Router>
          <div>
            <Route path="/" exact component={PagesWelcome} />
            <Route path="/users/new" component={UsersNew} />
            <Route path="/registry_entities/index" component={RegistryEntitiesIndex} />
            <Route path="/registry_entities/new" component={RegistryEntitiesNew} />
            <Route path="/explorer" component={PagesExplorer} />
          </div>
          <Header />
        </Router>
      </div>
    )
  }
}

export default App;
