import { combineReducers } from 'redux';
import modalReducer from './modalReducer';
// 다른 리듀서들을 import 하세요. 예: import userReducer from './userReducer';

const rootReducer = combineReducers({
  // 여기에 리듀서들을 추가합니다. 예: user: userReducer,
  modal: modalReducer
});


export default rootReducer;
