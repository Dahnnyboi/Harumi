import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { clearNavbarSearch } from '../../redux'
import SearchUser from '../partials-search/SearchUser'

import '../../stylesheets/partials/searchbar.scss'

function Searchbar({ users, more, input }) {
  const dispatch = useDispatch()

  return (
    <div className="searchbar">
      {
        users.map(user => {
          return <SearchUser
            profImg={user.profileImg}
            username={user.username}
            followersCount={user.followersCount}
          />
        })
      }
      {
        more ? 
          <Link to={{
            pathname: "/search",
            search: `?username=${input}`
          }} onClick={() => { dispatch(clearNavbarSearch()) }}>
            <h4>View more</h4>
          </Link>          
        : null
      }
    </div>
  )
}

export default Searchbar
