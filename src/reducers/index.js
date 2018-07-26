import { combineReducers } from 'redux'
import setsReducer from './setsReducer'
import cardsReducer from './cardsReducer'

export default combineReducers({
  sets: setsReducer,
  cards: cardsReducer
})