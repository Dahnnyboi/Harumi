import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import '../../stylesheets/partials/searchuser.scss'
import { clearNavbarSearch, resetProfilePage, clearPosts } from '../../redux'
import Image from '../partials/Image'

function SearchUser({ profImg, username, followersCount}) {
  const dispatch = useDispatch()
  const redirect = () => {
    dispatch(clearPosts())
    dispatch(resetProfilePage())
    dispatch(clearNavbarSearch())
  }

  return (
    <div className="searchuser">
      <Link to={`/profile/${username}`} onClick={() => { redirect() }}>
        <div className="profile-img">
          <div className="image">
            <Image 
              img={profImg.image}
              contentType={profImg.contentType}
              alt={profImg.alt}
            />
          </div>
        </div>
        <div className="user-info">
          <h4>{username}</h4>
          <p>{followersCount} followers</p>
        </div>
      </Link>
    </div>
  )
}

export default SearchUser
