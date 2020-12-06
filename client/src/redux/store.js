import { createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './root.reducer'

const store = createStore(rootReducer, applyMiddleware(thunk))

export default store