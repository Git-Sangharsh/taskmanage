import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  adminName: '',
  signInUserName: null,
  signInEmail: null,
  userTask: null,
  userTaskDesc: null,
  userMainArray: [],
  userCompleteArray : [],
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ADMIN_NAME':
      return { ...state, adminName: action.payload };
    case 'SET_SIGNIN_NAME':
      return { ...state, signInUserName: action.payload };
    case 'SET_SIGNIN_EMAIL':
      return { ...state, signInEmail: action.payload };
    case 'SET_USER_TASK':
      return { ...state, userTask: action.payload };
    case 'SET_USER_DESC':
      return { ...state, userTaskDesc: action.payload };
    case 'SET_USER_MAIN_ARRAY':
      return { ...state, userMainArray: action.payload };
    case 'SET_COMPLETE_ARRAY':
      return { ...state, userCompleteArray: action.payload };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: adminReducer,
});

export default store;
