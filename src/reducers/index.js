import { combineReducers } from 'redux'
import setsReducer from './setsReducer'
import cardsReducer from './cardsReducer'

export default combineReducers({
  setsReducer,
  cardsReducer
})