import actionTypes from '../actions';

const initialState = {};

export default function(state = initialState, action){
  switch(action.type){
    case actionTypes.SET_PAGE_DATA:
      return {
        ...action.data
      }
    case actionTypes.UPDATE_PAGE_DATA:
      return {
        ...state,
        ...action.data
      }
    default:
      return state;
  }
}