import { combineReducers } from 'redux';

import session from '../reducers/session.js';
import user from '../reducers/user.js';

const mydriaApp = combineReducers({
  session,
  user,
})

export default mydriaApp;