import {
  FETCHING_POSTS,
  SUCCESS_POSTS,

  FETCHING_PROFILE_POSTS,
  SUCCESS_PROFILE_POSTS,
  FAILURE_PROFILE_POSTS,

  RESET_PAGE,
  ADVANCE_PAGE,

  RESET_PROFILE_PAGE,
  ADVANCE_PROFILE_PAGE,

  DELETE_POST_REQUEST,
  DELETE_POST_REDUX,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,

  EDIT_POST_REQUEST,
  EDIT_POST_REDUX,
  EDIT_POST_SUCCESS,
  EDIT_POST_FAILURE,

  POST_FAVORITE_REQUEST,
  POST_FAVORITE_REDUX,
  POST_FAVORITE_SUCCESS,
  POST_FAVORITE_FAILURE,

  POST_UNFAVORITE_REQUEST,
  POST_UNFAVORITE_REDUX,
  POST_UNFAVORITE_SUCCESS,
  POST_UNFAVORITE_FAILURE,

  FETCH_COMMENTS_REQUEST,
  FETCH_COMMENTS_SUCCESS,
  FETCH_COMMENTS_FAILURE,

  ADVANCE_COMMENT_PAGE,

  POST_COMMENT_REQUEST,
  POST_COMMENT_REDUX,
  POST_COMMENT_SUCCESS,
  POST_COMMENT_FAILURE,

  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_REDUX,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILURE,

  CLEAR_POSTS
} from './posts.type'


export function fetchFeedPosts(page){
  const config = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }

  return (dispatch) => {
    fetchingPost(true)

    fetch(`http://localhost:5000/api/posts/feed?offset=${page}`, config)
    .then(response => { return response.json().then(json => ({ json, response })) })
    .then(({json, response}) => {
      dispatch(fetchingPost(false))
      if(!response.ok){
        Promise.reject()
      }
      
      dispatch(successPosts(json.posts, json.pagesLimit))
    }).catch(err => console.log(err))
  }
}

function fetchingPost(fetching){
  return {
    type: FETCHING_POSTS,
    fetching: fetching
  }
}

function successPosts(posts, pagesLimit){
  return{
    type: SUCCESS_POSTS,
    posts: posts,
    pagesLimit: pagesLimit,
  }
}

export function fetchProfilePosts(name, page) {
  const config = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }
  
  return (dispatch) => {
    fetchingProfilePosts(true)

    fetch(`http://localhost:5000/api/posts/feed/${name}?offset=${page}`, config)
    .then(response => { return response.json().then(json => ({ json, response })) })
    .then(({json, response}) => {
      dispatch(fetchingProfilePosts(false))
      if(!response.ok){
        console.log(json)
        dispatch(failureProfilePosts(json.message))
        Promise.reject()
      }
      
      dispatch(successProfilePosts(json.posts, json.pagesLimit))
    }).catch(err => console.log(err))
  }
}

function fetchingProfilePosts(state){
  return {
    type: FETCHING_PROFILE_POSTS,
    fetching: state
  }
}

function successProfilePosts(posts, limit){
  return {
    type: SUCCESS_PROFILE_POSTS,
    posts: posts,
    limit: limit
  }
}

function failureProfilePosts(error){
  return {
    type: FAILURE_PROFILE_POSTS,
    errorMessage: error
  }
}
export function resetPage(){
  return {
    type: RESET_PAGE
  }
}
export function advancePage(){
  return{
    type: ADVANCE_PAGE
  }
}

export function resetProfilePage(){
  return {
    type: RESET_PROFILE_PAGE
  }
}

export function advanceProfilePage(){
  return {
    type: ADVANCE_PROFILE_PAGE
  }
}

export function fetchDeletePost(slug){
  const config = {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  }

  return dispatch => {
    dispatch(deletePostRequest())
    fetch(`http://localhost:5000/api/posts/${slug}`, config)
    .then(response => { 
      if(response.status === 403){
        dispatch(deletePostFailure())
        Promise.reject()
      }
      return response.json()
    })
    .then(data => {
      dispatch(deletePostRedux(slug))
      dispatch(deletePostSuccess())
    }).catch(err => console.log(err))
  }
}

function deletePostRequest(){
  return {
    type: DELETE_POST_REQUEST
  }
}

function deletePostRedux(slug){
  return {
    type: DELETE_POST_REDUX,
    slug: slug
  }
}

function deletePostSuccess(){
  return {
    type: DELETE_POST_SUCCESS,
  }
}

function deletePostFailure(){
  return {
    type: DELETE_POST_FAILURE
  }
}

export function editPost(slug, index, input){
  const post = {
    title: input
  }

  const config = {
    method: 'PUT',
    headers: { 
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(post)
  }

  return dispatch => {
    dispatch(editPostRequest())

    fetch(`http://localhost:5000/api/posts/${slug}`, config)
      .then(response => { return response.json().then(json => ({ json, response})) })
      .then(({json, response}) => {
        if(!response.ok){
          dispatch(editPostFailure())
          Promise.reject()
        }

        console.log(json)
        dispatch(editPostRedux(index, input))
        dispatch(editPostSuccess())
      }).catch(err => console.log(err))
  }
}

function editPostRequest(){
  return {
    type: EDIT_POST_REQUEST
  }
}

function editPostRedux(index, input){
  return {
    type: EDIT_POST_REDUX,
    index: index,
    input: input
  }
}

function editPostSuccess(){
  return {
    type: EDIT_POST_SUCCESS,
  }
}

function editPostFailure(){
  return {
    type: EDIT_POST_FAILURE,
  }
}

export function postFavorite(slug, index){
  const config = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }

  return dispatch => {
    dispatch(favoPostRequest())

    fetch(`http://localhost:5000/api/posts/${slug}/favorite`, config)
      .then(response => { return response.json().then(json => ({ json, response})) })
      .then(({json, response}) => {
        if(!response.ok){
          dispatch(favoPostFailure())
          Promise.reject()
        }

        dispatch(favoPostRedux(index))
        dispatch(favoPostSuccess())
      }).catch(err => console.log(err))
  }
}

function favoPostRequest(){
  return {
    type: POST_FAVORITE_REQUEST
  }
}

function favoPostRedux(index){
  return {
    type: POST_FAVORITE_REDUX,
    index: index
  }
}

function favoPostSuccess(){
  return {
    type: POST_FAVORITE_SUCCESS
  }
}

function favoPostFailure(){
  return {
    type: POST_FAVORITE_FAILURE
  }
}

export function postUnfavorite(slug, index){
  const config = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }

  return dispatch => {
    dispatch(unfavoPostRequest())

    fetch(`http://localhost:5000/api/posts/${slug}/unfavorite`, config)
      .then(response => { return response.json().then(json => ({ json, response})) })
      .then(({json, response}) => {
        if(!response.ok){
          dispatch(unfavoPostFailure())
          Promise.reject()
        }

        dispatch(unfavoPostRedux(index))
        dispatch(unfavoPostSuccess())
      }).catch(err => console.log(err))
  }
}

function unfavoPostRequest() {
  return {
    type: POST_UNFAVORITE_REQUEST,
  }
}

function unfavoPostRedux(index){
  return {
    type: POST_UNFAVORITE_REDUX,
    index: index
  }
}

function unfavoPostSuccess(){
  return {
    type: POST_UNFAVORITE_SUCCESS
  }
}

function unfavoPostFailure(){
  return {
    type: POST_UNFAVORITE_FAILURE
  }
}

export function fetchComments(slug, offset, index){
  const config = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }

  return dispatch => {
    dispatch(fetchCommentsRequest())
    
    fetch(`http://localhost:5000/api/posts/${slug}/comments?offset=${offset}`, config)
    .then(response => { return response.json().then(json => ({ json, response})) })
    .then(({json, response}) => {
      if(!response.ok){
        dispatch(fetchCommentsFailure())
        Promise.reject()
      }

      dispatch(fetchCommentsSuccess(json.comments, index, json.pageLimit))
    }).catch(err => console.log(err))
  }
}

function fetchCommentsRequest(){
  return {
    type: FETCH_COMMENTS_REQUEST
  }
}

function fetchCommentsSuccess(comments, index, limit){
  return{
    type: FETCH_COMMENTS_SUCCESS,
    comments: comments,
    index: index,
    limit: limit
  }
}

function fetchCommentsFailure(){
  return{
    type: FETCH_COMMENTS_FAILURE
  }
}

export function advanceCommentPage(index){
  return {
    type: ADVANCE_COMMENT_PAGE,
    index: index
  }
}

export function postComment(comment, slug, index){
  const config = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ comment })
  }

  return (dispatch, getState) => {
    dispatch(postCommentRequest())

    fetch(`http://localhost:5000/api/posts/${slug}/comments`, config)
      .then(response => { return response.json().then(json => ({ json, response})) })
      .then(({json, response}) => {
        if(!response.ok){
          dispatch(postCommentFailure())
          Promise.reject()
        }

        const date = new Date()
        const isoDate = date.toISOString()
        const { profileImg } = getState().auth
        const creds = {
          id: json.id,
          author: {
            username: localStorage.getItem('username'),
            profileImg: profileImg
          },
          comment: comment,
          createdAt: isoDate,
          isYourComment: true
        }
        dispatch(postCommentRedux(creds, index))
        dispatch(postCommentSuccess())
      }).catch(err => console.log(err))
  }
}

function postCommentRequest(){
  return{
    type: POST_COMMENT_REQUEST
  }
}

function postCommentRedux(creds, index){
  return {
    type: POST_COMMENT_REDUX,
    creds: creds,
    index: index
  }
}

function postCommentSuccess(){
  return {
    type: POST_COMMENT_SUCCESS,
  }
}

function postCommentFailure(){
  return{
    type: POST_COMMENT_FAILURE
  }
}

export function deleteComment(slug, postIndex, commentIndex, id){
  const config = {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }

  return dispatch => {
    dispatch(deleteCommentRequest())

    fetch(`http://localhost:5000/api/posts/${slug}/comments/${id}`, config)
      .then(response => { return response.json().then(json => ({ json, response})) })
      .then(({json, response}) => {
        if(!response.ok){
          dispatch(deleteCommentFailure())
          Promise.reject()
        }

        console.log(json)
        dispatch(deleteCommentRedux(postIndex, id))
        dispatch(deleteCommentSuccess())
      }).catch(err => console.log(err))
  }
}

function deleteCommentRequest(){
  return {
    type: DELETE_COMMENT_REQUEST
  }
}

function deleteCommentRedux(postIndex, commentId){
  return {
    type: DELETE_COMMENT_REDUX,
    postIndex: postIndex, 
    commentId: commentId
  }
}

function deleteCommentSuccess(){
  return {
    type: DELETE_COMMENT_SUCCESS
  }
}

function deleteCommentFailure(){
  return {
    type: DELETE_COMMENT_FAILURE
  }
}

export function clearPosts(){
  return {
    type: CLEAR_POSTS
  }
}
