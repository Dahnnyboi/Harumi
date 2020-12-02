import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Navbar from './partials/Navbar'
import Dropbar from './partials/Dropbar'

function NoMatch() {
  const [open, setOpen] = useState(false)
  const isAuthenticated = useSelector(state => state.auth.authenticated)
  const location = useLocation()

  const clicked = () => {
    setOpen(!open)
  }

  return (
    <div>
      {
        isAuthenticated ?
        <>
          <Navbar click={clicked}/>
          {
          open ? 
            <Dropbar />
            :
              null
          }
        </>
        : null
      }
      
      <h1>404</h1>
      <h4>No url {location.pathname}of exists!</h4>
    </div>
  )
}

export default NoMatch
