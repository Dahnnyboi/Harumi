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

const initialState = {
  username: '',
  bio: '',
  profileImg: {},
  followersCount: 0,
  isYourProfile: false,
  isFollowing: false,
  isLoading: false,
  errMsg: '',

  fetchFollow: false,
  fetchUnfollow: false
}

const profileReducer = (state = initialState, action) => {
  switch(action.type){
    case REQUEST_USER_PROFILE: {
      return {
        ...state,
        isLoading: true
      }
    }
    case SUCCESS_USER_PROFILE: {
      return {
        ...state,
        username: action.creds.username,
        bio: action.creds.bio,
        followersCount: action.creds.followersCount,
        profileImg: action.creds.profileImg,
        isYourProfile: action.isYourProfile,
        isFollowing: action.isFollowing,
        isLoading: false
      }
    }
    case FAILURE_USER_PROFILE: {
      return {
        ...state,
        errMsg: action.errMsg
      }
    }

    case REQUEST_FOLLOW_PROFILE: {
      return {
        ...state,
        fetchFollow: true
      }
    }
    case REDUX_FOLLOW_PROFILE: {
      return{
        ...state,
        followersCount: state.followersCount + 1,
        isFollowing: true
      }
    }
    case SUCCESS_FOLLOW_PROFILE: {
      return {
        ...state,
        fetchFollow: false
      }
    }
    case FAILURE_FOLLOW_PROFILE: {
      return {
        ...state,
        fetchFollow: false
      }
    }

    case REQUEST_UNFOLLOW_PROFILE: {
      return {
        ...state,
        fetchUnfollow: true
      }
    }
    case REDUX_UNFOLLOW_PROFILE: {
      return {
        ...state,
        followersCount: state.followersCount - 1,
        isFollowing: false
      }
    }
    case SUCCESS_UNFOLLOW_PROFILE: {
      return {
        ...state,
        fetchUnfollow: false
      }
    }
    case FAILURE_UNFOLLOW_PROFILE: {
      return {
        ...state,
        fetchUnfollow: false
      }
    }

    case CLEAR_PROFILE: {
      return initialState
    }

    default: return { ...state }
  }
}

export default profileReducer