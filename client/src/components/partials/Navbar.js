import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout, searchNavbar, clearNavbarSearch, resetProfilePage, clearPosts } from '../../redux'
import { useLocation } from 'react-router-dom'

import Searchbar from './Searchbar'
import search from '../../res/search-1.svg'
import user from '../../res/user-3.svg'
import triangle from '../../res/polygon-1.svg'
import '../../stylesheets/partials/navbar.scss'

function Navbar({ click }) {
  const username = useSelector(state => state.auth.username)
  const navbarUsers = useSelector(state => state.search.navbarSearch)
  let more = useSelector(state => state.search.more)
  const location = useLocation()

  const [input, setInput] = useState('')
  const [openSearch, setOpenSearch] = useState(false)
  const dispatch = useDispatch()
  
  useEffect(() => {
    if(input.length >= 4){
      // dispatch
      setOpenSearch(true)
      dispatch(searchNavbar(input))
    } else if(input.length === 3){
      setOpenSearch(false)
      dispatch(clearNavbarSearch())
    }
  },[input, dispatch])

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo-container">
          <Link to="/feed" onClick={() => {
            if(location.pathname !== '/feed'){
              dispatch(clearPosts())
            } else {
            }
          }}>
            <h2>harumi</h2>
          </Link>
        </div>

        <div className="search-bar">
          <div className="search">
            <img src={search} alt="search"/>
            <input type="text" value={input} onChange={(e) => { setInput(e.target.value) }} placeholder="Search for a user"/>
          </div>
          

          {
            openSearch && navbarUsers.length > 0?
              <Searchbar 
                users={navbarUsers}
                more={more}
                input={input}
              />
              : null
          }
        </div>

        <div className="fill-bar">

        </div>

        <div className="user-bar">
          <div className="user-profile">
            <Link onClick={() => { 
              dispatch(resetProfilePage())
              dispatch(clearPosts())
            }}
              to={`/profile/${username}`}
            >
              <img src={user} alt="user"/>
              <h5>{username}</h5>
            </Link>
          </div>
          <h5 onClick={() => { 
            dispatch(logout())
          }}>Logout</h5>
        </div>
        <div className="dropdown" onClick={click}>
          <img src={triangle} alt="triangle" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
