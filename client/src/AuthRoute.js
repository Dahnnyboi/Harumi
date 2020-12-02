import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

function AuthRoute(props) {
  const isAuthenticated = useSelector(state => state.auth.authenticated)
  const pathname = window.location.pathname
  if(isAuthenticated){
    return <Redirect to="/feed" />
  } else if(isAuthenticated && pathname === "/"){
    return <Redirect to="/feed" />
  }

  return <Route {...props} />
}

export default AuthRoute
