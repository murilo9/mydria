import actionTypes from '../actions';

const initialState = {
  nickname: null,
  profilePicture: null,
  email: null,
  following: [],
  followedBy: []
}

export default function(state = initialState, action) {
  switch(action.type){
    case actionTypes.SET_USER_EMAIL:
      return {
        ...state,
        email: action.email
      }
    case actionTypes.SET_USER_NICKNAME:
      return {
        ...state,
        nickname: action.nickname
      }
    case actionTypes.SET_USER_PROFILE_PICTURE:
      return {
        ...state,
        profilePicture: action.profilePicture
      }
    case actionTypes.SET_USER_FOLLOWING:
      return {
        ...state,
        following: action.following
      }
    case actionTypes.SET_USER_FOLLOWEDBY:
      return {
        ...state,
        followedBy: action.followedBy
      }
    case actionTypes.UNSET_USER:
      return initialState;
    default:
      return state;
  }
}