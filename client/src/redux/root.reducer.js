import { combineReducers } from 'redux'
import authReducer from './auth/auth.reducers'
import profileReducer from './profile/profile.reducer'
import postsReducer from './posts/posts.reducer'
import searchReducer from './search/search.reducer'

const appReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  posts: postsReducer,
  search: searchReducer,
})

const rootReducer = (state, action) => {
  if(action.type === 'CLEAR_REDUX'){
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer