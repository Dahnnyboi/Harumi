import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import './stylesheets/app.scss'
import LandingPage from './components/LandingPage'
import SignupPage from './components/SignupPage'
import Unauthorized from './components/Unauthorized'
import NoMatch from './components/NoMatch'
import Feed from './components/Feed'
import Profile from './components/Profile'
import Searchs from './components/Searchs'
import Settings from './components/Settings'

import PrivateRoute from './PrivateRoute'
import AuthRoute from './AuthRoute'
import store from './redux/store'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/profile/:user/settings" component={Settings}/>
          <PrivateRoute path="/profile/:user" component={Profile}/>
          <PrivateRoute exact path="/feed" component={Feed} />
          <PrivateRoute exact path="/search" component={Searchs} />
          <Route exact path="/unauthorized" component={Unauthorized} />
          <Route exact path="/signup" component={SignupPage} />
          <AuthRoute path="/" component={LandingPage} />
          <Route path="*" component={NoMatch} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
