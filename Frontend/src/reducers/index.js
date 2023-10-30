import { combineReducers } from "redux"

import authReducer from './authReducer'
import postReducer from "./postReducer"
import alertReducer from "./alertReducer"

export const reducers = combineReducers({authReducer , postReducer, alertReducer})