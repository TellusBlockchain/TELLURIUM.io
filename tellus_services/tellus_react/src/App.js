import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from './components/Header';

import PagesWelcome from './routes/Pages/PagesWelcome';
import PagesAcceptInvite from './routes/Pages/PagesAcceptInvite';
import UsersNew from './routes/Users/UsersNew';
import RegistryEntitiesNew from './routes/RegistryEntities/RegistryEntitiesNew';
import RegistryEntitiesIndex from './routes/RegistryEntities/RegistryEntitiesIndex';
import PagesExplorer from './routes/Pages/PagesExplorer';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      current_user_role: undefined
    };
  }

  render () {
    return (
      <div className="App">
        <Router>
          <Header current_user_role={this.state.current_user_role} />
          
          <Route path="/" exact render={(props) => <PagesWelcome app={this} {...props} />} />
          <Route path="/invites/accept" render={(props) => <PagesAcceptInvite app={this} {...props} />} />
          <Route path="/users/new" component={UsersNew} />
          <Route path="/registry_entities/index" component={RegistryEntitiesIndex} />
          <Route path="/registry_entities/new" component={RegistryEntitiesNew} />
          <Route path="/explorer" component={PagesExplorer} />
        </Router>
      </div>
    )
  }
}

export default App;
