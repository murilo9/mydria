const initialState = {
  session: {
    active: false,
    token: null,
    userId: null
  },
  app: {
    user: {
      nickname: null,
      profilePic: null
    },
    page: {}
  }
}

export default function mydriaApp(state = initialState, action) {
  switch(action.type){

    default:
      return state;
  }
}