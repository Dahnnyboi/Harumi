import React, { useEffect, useCallback, useRef } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import SubmitPost from '../partials/SubmitPost'
import profileStyle from '../../stylesheets/profile.module.scss'
import '../../stylesheets/partials/btn.scss'
import { fetchProfilePosts, advanceProfilePage, followProfile, unfollowProfile } from '../../redux'
import Posts from '../partials/Posts'
import Favorites from '../partials/Favorites'
import ListComments from '../partials/ListComments'

function UserPosts({ uname, fetchPostsDispatch, advanceProfilePageDispatch, isYourProfile, isLoading, username, profilePage, posts, fetchingPost, profilePagesLimit, isFollowing, followProfileDispatch, unfollowProfileDispatch, error }) {
  let btmBoundaryRef = useRef(null)



  const handleObserver = useCallback((entities) => {
    const target = entities[0]
    if(target.isIntersecting){
      advanceProfilePageDispatch()
    }
  },[advanceProfilePageDispatch])

  useEffect(() => {

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    }

    const observer = new IntersectionObserver(handleObserver, options)
    if(btmBoundaryRef.current){
      observer.observe(btmBoundaryRef.current)
    }
  },[handleObserver])
  
  useEffect(() => {
    if(profilePage <= profilePagesLimit){
      console.log(uname, profilePage, profilePagesLimit)
      fetchPostsDispatch(uname, profilePage)
    }
  },[fetchPostsDispatch, uname, profilePage, profilePagesLimit])

  const follow = () => { followProfileDispatch(uname) }
  const unfollow = () => { unfollowProfileDispatch(uname) }

  if(error){
    console.log(error)
    return <Redirect to="/feed" />
  }

  return (
    <div className={`${profileStyle.userPosts}`}>
      {
        isYourProfile ?
          <SubmitPost/>
          : null
      }
      <div>
        {
          isFollowing ?
            isYourProfile ?
              null
              : <button className="button-mid" onClick={() => { unfollow() }}>Unfollow</button>
            : <button className="button-darkest" onClick={() => { follow() }}>Follow!</button>
        }
        {
          isLoading ? null : 
          <h4>{username}'s posts</h4>
        }
        {
          posts.map((post, index) => {
            return(
              <div>
                <Posts
                  slug={post.slug}
                  author={post.author.username}
                  img={post.author.profileImg}
                  title={post.title}
                  date={post.createdAt}
                  isYourPost={post.isYourPost}
                  index={index}
                />
                <Favorites 
                  count={post.favoriteCount}
                  isFavorited={post.isFavorited}
                  index={index}
                  slug={post.slug}
                />
                <ListComments 
                  slug={post.slug}
                  index={index}
                  commentsCount={post.commentsCount}
                  comments={post.comments}
                  pageLimit={post.pageLimit}
                  currentPage={post.currentPage}
                />
              </div>
            ) 
          })
        }
          <div ref={btmBoundaryRef}></div>
        {
          fetchingPost ? 
            <div className={`${profileStyle.loading}`}>
              <h4>Loading...</h4>
            </div> 
            : null
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    username: state.profile.username,
    isLoading: state.profile.isLoading,
    isFollowing: state.profile.isFollowing,
    isYourProfile: state.profile.isYourProfile,

    fetchingPost: state.posts.fetching,
    profilePage: state.posts.profilePage,
    profilePagesLimit: state.posts.profilePagesLimit,
    posts: state.posts.posts,
    error: state.posts.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPostsDispatch: (name, page) => { dispatch(fetchProfilePosts(name, page)) },
    advanceProfilePageDispatch: () => { dispatch(advanceProfilePage()) },
    followProfileDispatch: (name) => { dispatch(followProfile(name)) },
    unfollowProfileDispatch: (name) => { dispatch(unfollowProfile(name)) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPosts)
