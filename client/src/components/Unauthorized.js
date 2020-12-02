import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from './partials/Navbar'
import Dropbar from './partials/Dropbar'
import '../stylesheets/unauthorized.scss'

function Unauthorized() {
  const [open, setOpen] = useState(false)
  const isAuthenticated = useSelector(state => state.auth.authenticated)

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
      <div className="unauthorized">
        <h1>404</h1>
        <h3>Unauthorized</h3>
      </div>
    </div>
  )
}

export default Unauthorized
