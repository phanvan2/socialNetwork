import { combineReducers } from "redux";

import authReducer from './authReducer';
import postReducer from "./postReducer";
import alertReducer from "./alertReducer";
import contactFind from "./contactReducer";

export const reducers = combineReducers({authReducer , postReducer, alertReducer, contactFind})
