import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, clearPosts, resetProfilePage } from '../../redux'

import '../../stylesheets/partials/dropbar.scss'

function Dropbar() {
  const username = useSelector(state => state.auth.username)
  const dispatch = useDispatch()
  return (
    <div className="dropbody">
      <div className="container">
        <ul>
          <li>
            <Link to={`/profile/${username}`} onClick={() => { 
              dispatch(resetProfilePage())
              dispatch(clearPosts())
            }}>{username}</Link>
          </li>
          <li className="search">Search</li>
          <li onClick={() => { dispatch(logout()) }}>Logout</li>
        </ul>
      </div>
    </div>
  )
}

export default Dropbar
