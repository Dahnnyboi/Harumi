import { 
  REQUEST_USER_PROFILE,
  SUCCESS_USER_PROFILE,
  FAILURE_USER_PROFILE,
  
  CLEAR_PROFILE,

  REQUEST_FOLLOW_PROFILE,
  REDUX_FOLLOW_PROFILE,
  SUCCESS_FOLLOW_PROFILE,
  FAILURE_FOLLOW_PROFILE,

  REQUEST_UNFOLLOW_PROFILE,
  REDUX_UNFOLLOW_PROFILE,
  SUCCESS_UNFOLLOW_PROFILE,
  FAILURE_UNFOLLOW_PROFILE
} from './profile.types'

export function requestUser(username){
  const token = localStorage.getItem('token')

  const config = {
    methods: 'GET',
    headers: { 
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  return dispatch => {
    dispatch(requestUserProfile())

    fetch(`/api/users/${username}`, config)
      .then(response => { return response.json().then(json => ({ json, response})) })
      .then(({json, response}) => {
        if(!response.ok){
          dispatch(failureUserProfile('cannot get user'))
          Promise.reject(json)
        }
        
        dispatch(successUserProfile(json.user, json.isYourProfile, json.isFollowing))
      }).catch(err => {
        console.log(err)
      })
  }
}

function requestUserProfile(){
  return {
    type: REQUEST_USER_PROFILE
  }
}

function successUserProfile(creds, isYourProfile, isFollowing){
  return{
    type: SUCCESS_USER_PROFILE,
    creds: creds,
    isYourProfile: isYourProfile,
    isFollowing: isFollowing
  }
}

function failureUserProfile(err){
  return {
    type: FAILURE_USER_PROFILE,
    errMsg: err
  }
}

export function clearProfile(){
  return {
    type: CLEAR_PROFILE
  }
}

export function followProfile(name){
  const config = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }

  return dispatch => {
    dispatch(followProfileRequest())

    fetch(`/api/profiles/${name}`, config)
      .then(response => { return response.json().then(json => ({ json, response})) })
      .then(({json, response}) => {
        if(!response.ok){
          dispatch(followProfileFailure())
          Promise.reject()
        }

        console.log(json)
        dispatch(followProfileRedux())
        dispatch(followProfileSuccess())
      })
  }
}

function followProfileRequest(){
  return{
    type: REQUEST_FOLLOW_PROFILE
  }
}

function followProfileRedux(){
  return {
    type: REDUX_FOLLOW_PROFILE
  }
}

function followProfileSuccess(){
  return {
    type: SUCCESS_FOLLOW_PROFILE
  }
}

function followProfileFailure(){
  return {
    type: FAILURE_FOLLOW_PROFILE
  }
}

export function unfollowProfile(name){
  const config = {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }

  return dispatch => {
    dispatch(unfollowProfileRequest())

    fetch(`/api/profiles/${name}`, config)
      .then(response => { return response.json().then(json => ({ json, response})) })
      .then(({json, response}) => {
        if(!response.ok){
          dispatch(unfollowProfileFailure())
          Promise.reject()
        }

        console.log(json)
        dispatch(unfollowProfileRedux())
        dispatch(unfollowProfileSuccess())
      }).catch(err => console.log(err))
  }
}

function unfollowProfileRequest(){
  return {
    type: REQUEST_UNFOLLOW_PROFILE
  }
}

function unfollowProfileRedux(){
  return{
    type: REDUX_UNFOLLOW_PROFILE
  }
}

function unfollowProfileSuccess(){
  return {
    type: SUCCESS_UNFOLLOW_PROFILE
  }
}

function unfollowProfileFailure(){
  return{
    type: FAILURE_UNFOLLOW_PROFILE
  }
}