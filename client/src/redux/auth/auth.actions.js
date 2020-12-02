import {
  REQUEST_LOGIN,
  SUCCESS_LOGIN,
  FAILURE_LOGIN,

  LOGOUT,

  FETCH_RESOURCES_REQUEST,
  FETCH_RESOURCES_CONTINUE,
  FETCH_RESOURCES_SUCCESS,
  FETCH_RESOURCES_FAILURE,

  PUT_CHANGE_INFORMATION,
  SUCCESS_CHANGE_INFORMATION,
  FAILURE_CHANGE_INFORMATION,

  PUT_CHANGE_PROFILE,
  SUCCESS_CHANGE_PROFILE,
  FAILURE_CHANGE_PROFILE,
  
  REMOVE_RESPONSE,
  REMOVE_IMAGE_RESPONSE
} from './auth.types'

import axios from 'axios'

import { clearRedux } from '../index'

export const login = (usercreds) => {
  const user = {
    user: usercreds
  }
  const config = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(user)
  }
  return dispatch => {
    dispatch(loginRequest())

    return fetch('http://localhost:5000/api/users/login', config)
      .then(response => { return response.json().then(json => ({json, response})) })
      .then(({json, response}) => {
        if(!response.ok){
          if(json.info){
            dispatch(loginFailure(json.info.message))
          } else {
            dispatch(loginFailure(json.errors.message))
          }
        } else {
          localStorage.setItem('username', json.user.user.username)
          localStorage.setItem('token', json.user.user.token)
          dispatch(loginSuccess(json.user.user.username))
        }
      }).catch(err => {
        console.log(err)
        dispatch(loginFailure(err))
      })
  }
}

const loginRequest = () => {
  return {
    type: REQUEST_LOGIN
  }
}

const loginSuccess = (username) => {
  return{
    type: SUCCESS_LOGIN,
    username: username
  }
}

const loginFailure = (message) => {
  return {
    type: FAILURE_LOGIN,
    errMsg: message
  }
}

export const logout = () => {
  return dispatch => {
    dispatch(logoutrequest())
    dispatch(clearRedux())
    window.location.reload()
  }
}

const logoutrequest = () => {
  return {
    type: LOGOUT
  }
}

export const fetchResources = () => {
  return (dispatch, getState) => {
    const { profileImg } = getState().auth
    let imgExists = Object.keys(profileImg).length === 0 && profileImg.constructor === Object
    if(!imgExists){
      dispatch(fetchResourcesContinue())
      return Promise.resolve()
    } else {
      const config = {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }

      dispatch(fetchResourcesRequest())
      const username = localStorage.getItem('username')
      fetch(`http://localhost:5000/api/users/${username}/resources`, config)
        .then(response => { return response.json().then(json => ({ json, response})) })
        .then(({json, response}) => {
          if(!response.ok){
            dispatch(fetchResourcesFailure())
            return Promise.reject()
          }

          dispatch(fetchResourcesSuccess(json.resources))
        }).catch(err => console.log(err))

    }
  }
}

const fetchResourcesRequest = () => {
  return {
    type: FETCH_RESOURCES_REQUEST
  }
}

const fetchResourcesSuccess = (resources) => {
  return {
    type: FETCH_RESOURCES_SUCCESS,
    resources: resources
  }
}

const fetchResourcesContinue = () => {
  return {
    type: FETCH_RESOURCES_CONTINUE
  }
}

const fetchResourcesFailure = () => {
  return {
    type: FETCH_RESOURCES_FAILURE
  }
}

export function changeInfo(creds){
  const user = {
    email: creds.email,
    password: creds.password,
    bio: creds.bio
  }
  const config = {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(user)
  }
  
  return dispatch => {
    dispatch(putChangeInformation())

    fetch(`http://localhost:5000/api/users/update`, config)
      .then(response => { return response.json().then(json => ({ json, response })) })
      .then(({json, response}) => {
        if(!response.ok){
          dispatch(failureChangeInformation())
          Promise.reject()
        }

        dispatch(successChangeInformation(json.user, json.response))
      })
  }
}

function putChangeInformation(){
  return {
    type: PUT_CHANGE_INFORMATION
  }
}

function successChangeInformation(resources, response){
  return {
    type: SUCCESS_CHANGE_INFORMATION,
    resources: resources,
    response: response
  }
}

function failureChangeInformation(){
  return {
    type: FAILURE_CHANGE_INFORMATION
  }
}

function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return window.btoa(binary);
};


export function changeProfile(photo){
  const config = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  }

  let formData = new FormData()
  formData.append('profileImage', photo.files[0])
  for(let pair of formData.entries()) {
    console.log(pair[0]+ ', '+ pair[1]); 
  }

  return dispatch => {
    dispatch(putChangeProfile())

    axios.put(`http://localhost:5000/api/users/update`, formData, config)
      .then(response => {
        return response.data
      } )
      .then(json => {
        const profileImg = json.user.profileImg

        const data = profileImg.image.data
        const imageData = arrayBufferToBase64(data)
        const newProfileImage = {
          image: imageData,
          alt: profileImg.alt,
          contentType: profileImg.contentType
        }

        dispatch(successChangeProfile(newProfileImage))
      }).catch(err => {
        console.log(err)
        dispatch(failureChangeProfile())
      })
  }
}

function putChangeProfile(){
  return { type: PUT_CHANGE_PROFILE }
}

function successChangeProfile(profileImg){
  return { 
    type: SUCCESS_CHANGE_PROFILE,
    profileImg: profileImg
  }
}

function failureChangeProfile(){
  return {
    type: FAILURE_CHANGE_PROFILE
  }
}

export function removeResponse(){
  return { type: REMOVE_RESPONSE }
}

export function removeImageResponse(){
  return { type: REMOVE_IMAGE_RESPONSE }
}