import React, { useEffect, useRef } from 'react'

import { useLocation } from 'react-router-dom'
import { fetchSearch, advanceSearchPage, clearSearch, resetSearchPage } from '../redux'
import SearchResults from './partials-search/SearchResults'
import { connect } from 'react-redux'
import Navbar from './partials/Navbar'
import searchStyle from '../stylesheets/search.module.scss'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Search({ fetchSearchDispatch, advanceSearchPageDispatch, clearSearchDispatch, currentPage, searchFetch, searchs, pageLimit }) {
  let query = useQuery().get("username")
  const queryRef = useRef(null)

  useEffect(() => {
    console.log(query, currentPage)
    fetchSearchDispatch(query, currentPage)

    return () => {
    }
  },[fetchSearchDispatch, query, currentPage])

  useEffect(() => {
    if(queryRef.current !== query){
      clearSearchDispatch()
    }
    queryRef.current = query
  },[query, clearSearchDispatch])

  return (
    <div>
      <Navbar />
      <div className={`${searchStyle.container}`}>
        <div className={`${searchStyle.fill3}`}></div>
        <div className={`${searchStyle.fill5}`}>
          {
            query ?
              <h3>Results {query}</h3>
            : <h3>No user query</h3>
          }
          {
            query ?
              searchs.map((search, index) => {
                return <SearchResults 
                  img={search.profileImg}
                  username={search.username}
                  followersCount={search.followersCount}
                  isYourProfile={search.isYourProfile}
                  isFollowing={search.isFollowing}
                  post={search.post}
                  index={index}
                />
              })
              : null
          }
          {
            query ?
              searchFetch ?
                <div>
                  <h4>Loading...</h4>
                </div>
                : null
              : null
          }
          {
            query ?
              currentPage === pageLimit ? <div className={`${searchStyle.noview}`}>No more results</div>
              : 
              <button className={`${searchStyle.view}`} onClick={() => { advanceSearchPageDispatch() }}>View more</button>
              : null
          }
        </div>
        <div className={`${searchStyle.fill4}`}></div>
      </div>
      
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    searchs: state.search.searchs,
    currentPage: state.search.currentPage,
    pageLimit: state.search.pageLimit,
    searchFetch: state.search.searchFetch
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    advanceSearchPageDispatch: () => { dispatch(advanceSearchPage()) },
    fetchSearchDispatch: (username, page) => { dispatch(fetchSearch(username, page))},
    clearSearchDispatch: () => { dispatch(clearSearch()) },
    resetSearchPageDispatch: () => { dispatch(resetSearchPage()) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
