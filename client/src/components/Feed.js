import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import Navbar from './partials/Navbar'
import Dropbar from './partials/Dropbar'
import ListComments from './partials/ListComments'
import Posts from './partials/Posts'
import Favorites from './partials/Favorites'
import feedStyle from '../stylesheets/feed.module.scss'
import SubmitPost from './partials/SubmitPost'

import { fetchResources, clearPosts, resetPage, fetchFeedPosts, advancePage, resetProfilePage } from '../redux'
function Feed(props) {
  const [open, setOpen] = useState(false)
  const { clearPostsDispatch, resetPageDispatch, resetProfilePageDispatch, fetchResourcesDispatch, fetchFeedPostsDispatch, advancePageDispatch } = props
  const { page, pagesLimit, fetchingPost, posts } = props
  let btmBoundaryRef = useRef()

  useEffect(() => {
    fetchResourcesDispatch()
    
    return () => {
      console.log("cleanup")
      clearPostsDispatch()
      resetPageDispatch()
      resetProfilePageDispatch()
    }
  },[resetPageDispatch, clearPostsDispatch, fetchResourcesDispatch, resetProfilePageDispatch])

  const handeleObserver = useCallback((entities) => {
    const target = entities[0]
    if(target.isIntersecting){
      advancePageDispatch()
    }
  }, [advancePageDispatch])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    }

    const observer = new IntersectionObserver(handeleObserver, options)
    if(btmBoundaryRef.current){
      observer.observe(btmBoundaryRef.current)
    }
  }, [handeleObserver])

  useEffect(() => {
    if(page <= pagesLimit){
      console.log(page, pagesLimit)
      fetchFeedPostsDispatch(page)
    }
  }, [page, pagesLimit, fetchFeedPostsDispatch])

  const clicked = () => {
    setOpen(!open)
  }

  return (
    <div>
      <Navbar click={clicked}/>
      {
        open ? 
          <Dropbar />
        :
          null
      }
      <div className={`${feedStyle.feedBody}`}>
        <div className={`${feedStyle.container}`}>
          <div className={`${feedStyle.fill3}`}></div>

          <div className={`${feedStyle.fill5}`}>
            <SubmitPost />
            <h4>Newsfeed</h4>

            {
              posts.map((post, index) => {
                return (
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
            {
              fetchingPost ? <h4>Loading...</h4>
              : null
            }
            <div ref={btmBoundaryRef}></div>
          </div>

          <div className={`${feedStyle.fill4}`}></div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    fetchingPost: state.posts.fetching,
    page: state.posts.page,
    pagesLimit: state.posts.pagesLimit,
    posts: state.posts.posts,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearPostsDispatch: () => { dispatch(clearPosts()) },
    resetProfilePageDispatch: () => { dispatch(resetProfilePage()) },
    resetPageDispatch: () => { dispatch(resetPage()) },
    fetchResourcesDispatch: () => { dispatch(fetchResources()) },
    fetchFeedPostsDispatch: (page) => { dispatch(fetchFeedPosts(page))},
    advancePageDispatch: () => { dispatch(advancePage())}
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed)
