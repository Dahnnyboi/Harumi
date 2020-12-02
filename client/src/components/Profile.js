import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { clearProfile, clearPosts, fetchResources, resetPage, resetProfilePage } from '../redux'

import Navbar from './partials/Navbar'
import Dropbar from './partials/Dropbar'
import UserInfo from './partials-profile/UserInfo'
import UserPosts from './partials-profile/UserPosts'
import UserFollowing from './partials-profile/UserFollowing'
import profileStyle from '../stylesheets/profile.module.scss'


function Profile() {
  const [open, setOpen] = useState(false)
  const { user } = useParams()
  const dispatch = useDispatch()
  const clicked = () => { setOpen(!open) }

  useEffect(() => {
    dispatch(fetchResources())
    dispatch(clearProfile())

    return () => {
      console.log("cleanup profile")
      dispatch(clearPosts())
      dispatch(resetProfilePage())
      dispatch(resetPage())
    }
  },[dispatch, user])
  

  return (
    <div>
      <Navbar click={clicked}/>
      {
        open ? 
          <Dropbar />
        :
          null
      }
      <div className={`${profileStyle.container}`}>
        <UserInfo uname={user}/>
        <UserPosts uname={user}/>
        <UserFollowing />
      </div>
    </div>
  )
}

export default Profile
