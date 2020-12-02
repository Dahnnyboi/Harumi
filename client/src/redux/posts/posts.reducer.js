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

let initialState = {
  posts: [],
  fetching: false,
  error: false,
  errorMessage: '',

  page: 0,
  pagesLimit: 0,

  profilePage: 0,
  profilePagesLimit: 0,

  delFetching: false,

  editFetching: false,

  favoFetching: false,

  unfavoFetching: false,

  fetchComments: false,

  postCommentFetching: false,

  delCommentFetching: false,
}

const postsReducer = (state = initialState, action) => {
  switch(action.type){
    case FETCHING_POSTS: 
      return{
        ...state,
        fetching: action.fetching
      }
    case SUCCESS_POSTS:
      return {
        ...state,
        posts: state.posts.concat(action.posts),
        pagesLimit: action.pagesLimit,
      }

    case FETCHING_PROFILE_POSTS:
      return{
        ...state,
        fetching: action.fetching
      }
    case SUCCESS_PROFILE_POSTS:
      return{
        ...state,
        posts: state.posts.concat(action.posts),
        profilePagesLimit: action.limit
      }
    case FAILURE_PROFILE_POSTS:
      return {
        ...state,
        error: true,
        errorMessage: action.errorMessage
      }
    
    case RESET_PAGE: 
      return {
        ...state,
        page: 0,
        pagesLimit: 0
      }
    case ADVANCE_PAGE:
      return{
        ...state,
        page: state.page + 1
      }

    case RESET_PROFILE_PAGE:
      return {
        ...state,
        profilePage: 0,
        profilePagesLimit: 0
      }

    case ADVANCE_PROFILE_PAGE: 
      return {
        ...state,
        profilePage: state.profilePage + 1
      }
    
    case DELETE_POST_REQUEST:
      return {
        ...state,
        delFetching: true
      }
    case DELETE_POST_REDUX: {
      const newPosts = state.posts.filter(post => post.slug !== action.slug)
      return {
        ...state,
        posts: newPosts
      }
    }
    case DELETE_POST_SUCCESS: {
      return {
        ...state,
        delFetching: false
      }
    }
    case DELETE_POST_FAILURE: {
      return {
        ...state,
        delFetching: false
      }
    }

    case EDIT_POST_REQUEST: {
      return {
        ...state,
        editFetching: true
      }
    }
    case EDIT_POST_REDUX: {
      let newPosts = [...state.posts]
      newPosts[action.index].title = action.input

      return {
        ...state,
        posts: newPosts,
      }
    }
    case EDIT_POST_SUCCESS: {
      return {
        ...state,
        editFetching: false
      }
    }
    case EDIT_POST_FAILURE: {
      return {
        ...state,
        editFetching: false
      }
    }
    
    case POST_FAVORITE_REQUEST: {
      return {
        ...state,
        favoFetching: true
      }
    }
    case POST_FAVORITE_REDUX: {
      const newPost = [...state.posts]
      newPost[action.index].isFavorited = true
      newPost[action.index].favoriteCount += 1

      return {
        ...state, 
        posts: newPost
      }
    }
    case POST_FAVORITE_SUCCESS: {
      return{
        ...state,
        favoFetching: false
      }
    }
    case POST_FAVORITE_FAILURE: {
      return {
        ...state,
        favoFetching: false
      }
    }

    case POST_UNFAVORITE_REQUEST: {
      return {
        ...state,
        unfavoFetching: true
      }
    }
    case POST_UNFAVORITE_REDUX: {
      const newPost = [...state.posts]
      newPost[action.index].isFavorited = false
      newPost[action.index].favoriteCount -= 1
      
      return {
        ...state,
        posts: newPost
      }
    }
    case POST_UNFAVORITE_SUCCESS: {
      return {
        ...state,
        unfavoFetching: false
      }
    }
    case POST_UNFAVORITE_FAILURE: {
      return {
        ...state,
        unfavoFetching: false
      }
    }

    case FETCH_COMMENTS_REQUEST: {
      return {
        ...state,
        fetchComments: true
      }
    }
    case FETCH_COMMENTS_SUCCESS: {
      let newPost = [...state.posts]
      if(newPost[action.index]){
        newPost[action.index].pageLimit = action.limit
        newPost[action.index].comments.push(...action.comments)
      }
      
      return {
        ...state,
        posts: newPost,
        fetchComments: false
      }
    }
    case FETCH_COMMENTS_FAILURE: {
      return {
        ...state,
        fetchComments: false
      }
    }

    case ADVANCE_COMMENT_PAGE: {
      let newPost = [...state.posts]
      newPost[action.index].currentPage += 1

      return {
        ...state,
        posts: newPost
      }
    }

    case POST_COMMENT_REQUEST: {
      return {
        ...state,
        postCommentFetching: true
      }
    }
    case POST_COMMENT_REDUX: {
      const newPost = [...state.posts]
      newPost[action.index].comments.unshift(action.creds)
      return {
        ...state,
        posts: newPost
      }
    }
    case POST_COMMENT_SUCCESS: {
      return {
        ...state,
        postCommentFetching: false
      }
    }
    case POST_COMMENT_FAILURE: {
      return {
        ...state,
        postCommentFetching: false
      }
    }

    case DELETE_COMMENT_REQUEST: {
      return {
        ...state,
        delCommentFetching: true
      }
    }

    case DELETE_COMMENT_REDUX: {
      let newPost = [...state.posts]
      let comments = newPost[action.postIndex].comments
      for(let i = 0; i < comments.length; i++){
        if(comments[i].id === action.commentId){
          comments.splice(i, 1)
          break
        }
      }
      newPost[action.postIndex].comments = comments

      return{
        ...state,
        posts: newPost
      }
    }

    case DELETE_COMMENT_SUCCESS: {
      return {
        ...state,
        delCommentFetching: false
      }
    }

    case DELETE_COMMENT_FAILURE: {
      return{
        ...state,
        delCommentFetching: false
      }
    }

    case CLEAR_POSTS: {
      return {
        ...state,
        posts: []
      }
    }

    default: return { ...state }
  }
}

export default postsReducer