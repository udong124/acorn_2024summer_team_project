// reducers/userReducer.js
const initialUserState = {
    userName: null,
    role: null
  };
  
  function userReducer(state = initialUserState, action) {
    switch (action.type) {
      case 'SET_USER':
        return {
          ...state,
          userName: action.payload.userName,
          role: action.payload.role
        };
      default:
        return state;
    }
  }
  
  export default userReducer;
  