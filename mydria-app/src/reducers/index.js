import { combineReducers } from 'redux';

import actions from '../actions';

import session from '../reducers/session.js';
import user from '../reducers/user.js';
import page from '../reducers/page';

const mydriaApp = combineReducers({
  session,
  user,
  page
})

export default mydriaApp;