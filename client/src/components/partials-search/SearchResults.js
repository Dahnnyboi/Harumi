import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { searchPost, clearPosts, resetProfilePage } from '../../redux'
import Image from '../partials/Image'
import Posts from '../partials/Posts'
import '../../stylesheets/partials/searchresults.scss'

const SearchResults = ({ img, username, followersCount, isFollowing, index, post, isYourProfile }) => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(searchPost(username, index))
  },[dispatch, username, index])

  return (
    <div className="search-results">
      <Link to={`/profile/${username}`} onClick={() => { 
        dispatch(resetProfilePage())
        dispatch(clearPosts())
      }}>
        <div className="user-info">
          <div className="profImg">
            <Image 
              img={img.image}
              alt={img.alt}
              contentType={img.contentType}
            />
          </div>
          <div className="username">
            <h4>{username}</h4>
            <p>{followersCount} followers</p>
          </div>
        </div>
      </Link>
      <div className="isFollowing">
        {
          isYourProfile ? null
            : isFollowing ?
              <p>Following</p>
              : <p>Not following</p>
        }
        {
          post !== undefined ?
            Object.keys(post).length !== 0 ?
              <h3 className="intro">{username}'s recent post</h3>
            : null
          : null
        }
        {
          post !== undefined ?
            Object.keys(post).length !== 0 ?
              <Posts
                slug={post.slug}
                author={post.author.username}
                img={post.author.profileImg}
                title={post.title}
                date={post.createdAt}
                isYourPost={false}
                index={index}
              />
            : null
          : null
        }
        
      </div>
      
    </div>
  );
}

export default SearchResults;
