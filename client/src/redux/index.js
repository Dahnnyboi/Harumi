export * from './auth/auth.actions'
export * from './profile/profile.actions'
export * from './posts/posts.action'
export * from './search/search.actions'

export const clearRedux = () => {
  return {
    type: 'CLEAR_REDUX'
  }
}