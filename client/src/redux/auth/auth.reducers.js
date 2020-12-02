import { 
  REQUEST_LOGIN,
  SUCCESS_LOGIN,
  FAILURE_LOGIN,

  LOGOUT,

  FETCH_RESOURCES_REQUEST,
  FETCH_RESOURCES_SUCCESS,
  FETCH_RESOURCES_CONTINUE,
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

const initialState = {
  appName: 'harumi',
  authFetching: false,
  profileImg: {},
  username: localStorage.getItem('username') ? localStorage.getItem('username') : '',
  bio: '',
  email: '',
  authenticated: localStorage.getItem('token') ? true : false,
  errMsg: '',

  fetchResources: false,
  changeResources: false,
  response: '',
  imageResponse: ''
}

const authReducer = (state = initialState, action) => {
  switch(action.type){
    case REQUEST_LOGIN:
      return {
        ...state,
        authFetching: true
      }
    case SUCCESS_LOGIN:
      return {
        ...state,
        authFetching: false,
        username: action.username,
        authenticated: true
      }
    case FAILURE_LOGIN:
      return {
        ...state, 
        authFetching: false,
        isAuthenticated: false,
        errMsg: action.errMsg
      }
    
    case LOGOUT:
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      return{
        ...state,
        isAuthenticated: false,
        appName: 'harumi'
      }

    case FETCH_RESOURCES_REQUEST: {
      return {
        ...state,
        fetchResources: true
      }
    }
    case FETCH_RESOURCES_SUCCESS: {
      return {
        ...state,
        profileImg: action.resources.profileImg,
        bio: action.resources.bio,
        email: action.resources.email,
        fetchResources: false
      }
    }
    case FETCH_RESOURCES_CONTINUE: {
      return {
        ...state
      }
    }
    case FETCH_RESOURCES_FAILURE: {
      return {
        ...state,
        fetchResources: false
      }
    }

    case PUT_CHANGE_INFORMATION: {
      return {
        ...state,
        changeResources: true
      }
    }
    case SUCCESS_CHANGE_INFORMATION: {
      return {
        ...state,
        profileImg: action.resources.profileImg,
        bio: action.resources.bio,
        email: action.resources.email,
        response: action.response,
        changeResources: false
      }
    }
    case FAILURE_CHANGE_INFORMATION: {
      return {
        ...state,
        changeResources: false
      }
    }

    case PUT_CHANGE_PROFILE: {
      return {
        ...state,
        changeResources: true
      }
    }
    case SUCCESS_CHANGE_PROFILE: {
      const newProfileImage = {
        image: action.profileImg.image,
        contentType: action.profileImg.contentType,
        alt: action.profileImg.alt
      }
      return {
        ...state,
        changeResources: false,
        profileImg: Object.assign({}, newProfileImage ),
        imageResponse: 'Successfully updated your image'
      }
    }
    case FAILURE_CHANGE_PROFILE: {
      return {
        ...state,
        changeResources: false
      }
    }

    case REMOVE_RESPONSE: {
      return{
        ...state,
        response: ''
      }
    }
    case REMOVE_IMAGE_RESPONSE: {
      return {
        ...state,
        imageResponse: ''
      }
    }
    default:
      return { ...state }
  }
}

export default authReducer