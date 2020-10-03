import actionTypes from '../actions';

const initialState = {
  active: false,
  token: null,
  userId: null
}

export default function(state = initialState, action) {
  switch(action.type) {
    case actionTypes.SET_SESSION_TOKEN:
      return {
        ...state,
        token: action.token,
      }
    case actionTypes.SET_SESSION_USERID:
      return {
        ...state,
        userId: action.userId
      }
    case actionTypes.SET_SESSION_ACTIVE:
      if(action.active){
        return {
          ...state,
          active: true
        }
      }
      else{
        return initialState;
      }
    case actionTypes.SET_DARK_THEME:
      return {
        ...state,
        darkTheme: action.active
      }
    default:
      return state;
  }
}