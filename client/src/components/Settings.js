import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, Redirect, useRouteMatch, Switch, Route} from 'react-router-dom'

import { fetchResources } from '../redux'
import setStyle from '../stylesheets/settings.module.scss'
import SettingsLink from './partials-settings/SettingsLink'
import Navbar from './partials/Navbar'
import Dropbar from './partials/Dropbar'
import Set from './partials-settings/Set'

function Settings() {
  const { user } = useParams()
  const { url, path } = useRouteMatch()
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const authUser = useSelector(state => state.auth.username)
  const isAuthenticated = useSelector(state => state.auth.authenticated)
  const tokenExist = localStorage.getItem('token') ? true : false

  useEffect(() => {
    if(user === authUser){
      dispatch(fetchResources())
    }
  },[user, authUser, dispatch])

  if(user !== authUser){
    return <Redirect to="/unauthorized" />
  } else if(!isAuthenticated && !tokenExist){
    return <Redirect to="/" />
  } else if(!isAuthenticated){
    return <Redirect to="/unauthorized" />
  }

  const openDropbar = () => { setOpen(!open) }
  return(
    <div>
      <Navbar click={openDropbar}/>
      {
        open ? 
          <Dropbar />
        :
          null
      }
      <div className={`${setStyle.settingsContainer}`}>
        <div className={`${setStyle.sideNav}`}>
          <ul>
            <SettingsLink exact={true} to={`${url}/info`} label="information" />
            <SettingsLink to={`${url}/personal`} label="personal" />
          </ul>
        </div>
        <div className={`${setStyle.content}`}>
          <Switch>
            <Route path={`${path}/:set`}>
              <Set />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default Settings
