import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

function PrivateRoute(props) {
  const isAuthenticated = useSelector(state => state.auth.authenticated)
  const tokenExist = localStorage.getItem('token') ? true : false
  if(isAuthenticated){
    return <Route {...props} />
  } else if(!isAuthenticated && !tokenExist){
    return <Redirect to="/" />
  } else if(!isAuthenticated){
    return <Redirect to="/unauthorized" />
  }
}

export default PrivateRoute
