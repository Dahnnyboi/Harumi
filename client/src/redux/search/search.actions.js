import {
  SEARCH_NAVBAR_REQUEST,
  SEARCH_NAVBAR_SUCCESS,
  SEARCH_NAVBAR_FAILURE,

  CLEAR_NAVBAR_SEARCH,

  ADVANCE_SEARCH_PAGE,
  RESET_SEARCH_PAGE,

  REQUEST_SEARCH_FETCH,
  SUCCESS_SEARCH_FETCH,
  FAILURE_SEARCH_FETCH,

  REQUEST_SEARCH_POST,
  SUCCESS_SEARCH_POST,
  FAILURE_SEARCH_POST,

  CLEAR_SEARCH,
  RESET_PAGE
} from './search.types'

export function searchNavbar(query){
  const config = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }

  return dispatch => {
    dispatch(searchNavbarRequest())

    fetch(`/api/users/search/${query}`, config)
      .then(response => { return response.json().then(json => ({ json, response})) })
      .then(({json, response}) => {
        if(!response.ok){
          dispatch(searchNavbarFailure())
          Promise.reject()
        }

        dispatch(searchNavbarSuccess(json.users, json.more))
      }).catch(err => console.log(err))
  }
}

function searchNavbarRequest(){
  return {
    type: SEARCH_NAVBAR_REQUEST
  }
}

function searchNavbarSuccess(users, more){
  return {
    type: SEARCH_NAVBAR_SUCCESS,
    users: users,
    more
  }
}

function searchNavbarFailure(){
  return {
    type: SEARCH_NAVBAR_FAILURE
  }
}

export function clearNavbarSearch(){
  return {
    type: CLEAR_NAVBAR_SEARCH
  }
}

export function advanceSearchPage(){
  return {
    type: ADVANCE_SEARCH_PAGE
  }
}

export function resetSearchPage(){
  return {
    type: RESET_SEARCH_PAGE
  }
}

export function fetchSearch(username, page){
  const config = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }

  return (dispatch) => {
    dispatch(requestSearchFetch())

    fetch(`/api/users/search/feed/${username}?offset=${page}`, config)
      .then(response => { return response.json().then(json => ({ json, response})) })
      .then(({json, response}) => {
        if(!response.ok){
          dispatch(failureSearchFetch())
          Promise.reject()
        }

        dispatch(successSearchFetch(json.users, json.count, json.pageLimit))
      })
  }
}

function requestSearchFetch(){
  return {
    type: REQUEST_SEARCH_FETCH
  }
}

function successSearchFetch(users, count, pageLimit){
  return {
    type: SUCCESS_SEARCH_FETCH,
    users: users,
    count: count,
    pageLimit: pageLimit
  }
}

function failureSearchFetch(){
  return {
    type: FAILURE_SEARCH_FETCH
  }
}

export function searchPost(username, index){
  const config = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }

  return dispatch => {
    dispatch(requestSearchPost())

    fetch(`/api/posts/${username}/post`, config)
      .then(response => { return response.json().then(json => ({ json, response})) })
      .then(({json, response}) => {
        if(!response.ok){
          dispatch(failureSearchPost())
          Promise.reject()
        }
        
        if(Object.keys(json.post).length !== 0){
          dispatch(successSearchPost(json.post, index))
        }
      }).catch(err => console.log(err))
  }
}

function requestSearchPost(){
  return {
    type: REQUEST_SEARCH_POST
  }
}

function successSearchPost(post, index){
  return {
    type: SUCCESS_SEARCH_POST,
    post: post, 
    index: index
  }
}

function failureSearchPost(){
  return {
    type: FAILURE_SEARCH_POST
  }
}

export function clearSearch(){
  return {
    type: CLEAR_SEARCH
  }
}

export function resetPage(){
  return {
    type: RESET_PAGE
  }
}