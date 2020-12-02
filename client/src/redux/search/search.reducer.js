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

const initialState = {
  navbarSearch: [],
  navbarFetch: false,
  more: false,

  currentPage: 0,

  searchs: [],
  searchFetch: false,
  count: 0,
  pageLimit: 0,

  postFetch: false,
}

const searchReducer = (state = initialState, action) => {
  switch(action.type){
    case SEARCH_NAVBAR_REQUEST: {
      return {
        ...state,
        navbarFetch: true
      }
    }
    case SEARCH_NAVBAR_SUCCESS: {
      return {
        ...state,
        navbarSearch: action.users,
        navbarFetch: false,
        more: action.more
      }
    }
    case SEARCH_NAVBAR_FAILURE: {
      return {
        ...state,
        navbarFetch: false
      }
    }

    case CLEAR_NAVBAR_SEARCH: {
      return {
        ...state,
        navbarSearch: []
      }
    }

    case ADVANCE_SEARCH_PAGE: {
      return {
        ...state,
        currentPage: state.currentPage  + 1
      }
    }

    case RESET_SEARCH_PAGE: {
      return {
        ...state, 
        currentPage: 0
      }
    }

    case REQUEST_SEARCH_FETCH: {
      return {
        ...state,
        searchFetch: true
      }
    }
    case SUCCESS_SEARCH_FETCH: {
      return {
        ...state,
        searchFetch: false,
        pageLimit: action.pageLimit,
        count: action.count,
        searchs: state.searchs.concat(action.users)
      }
    }
    case FAILURE_SEARCH_FETCH: {
      return{
        ...state,
        searchFetch: false
      }
    }

    case REQUEST_SEARCH_POST: {
      return {
        ...state,
        postFetch: true
      }
    }
    case SUCCESS_SEARCH_POST: {
      const newSearch = [...state.searchs]
      newSearch[action.index].post = action.post
      return {
        ...state,
        postFetch: false,
        searchs: newSearch
      }
    }
    case FAILURE_SEARCH_POST: {
      return {
        ...state,
        postFetch: false
      }
    }

    case RESET_PAGE: {
      return {
        ...state,
        currentPage: 0
      }
    }
    case CLEAR_SEARCH: {
      return initialState
    }
    default: return { ...state }
  }
}

export default searchReducer