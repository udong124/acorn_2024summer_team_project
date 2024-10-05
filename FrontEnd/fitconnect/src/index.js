import React, { Suspense } from "react";
import ReactDOM from 'react-dom/client';

import { legacy_createStore as createStore } from 'redux';
import { decodeToken } from 'jsontokens';
import rootReducer from './reducers';
import "./assets/scss/style.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom"; // BrowserRouter로 변경
import Loader from "./layouts/loader/Loader";
import axios from 'axios';
import { Provider } from "react-redux";

// id가 root인 곳에 UI 출력하기
const root = ReactDOM.createRoot(document.getElementById('root'));

// token이 존재한다면 token에서 값을 읽어와서 저장할 변수 만들기
let userName = null;
let userRole = null;

// 만일 토큰이 존재한다면
if (localStorage.token) {
  // 토큰을 디코딩 ( 앞에 7 자리를 제거한 , Bearer+ 를 제거한 문자열을 디코딩)
  const result = decodeToken(localStorage.token.substring(7));
  console.log("토큰을 디코딩한 결과 확인해 보기");
  console.log(result);
  
  // expire 되는 시간이 초 단위로 저장되어 있으므로 1000 을 곱해서 ms 초 단위로 만든다
  const expTime = result.payload.exp * 1000;
  
  // 현재 시간 ms 초 단위로 얻어내기 
  const now = new Date().getTime();
  
  // 만일 유효기간이 만료되지 않았다면 
  if (expTime > now) {
    // 토큰에 저장되어 있는 subject (userName) 을 변수에 담는다. 
    userName = result.payload.sub;
    // axios 의 header 에 인증정보를 기본으로 가지고 갈 수 있도록 설정 
    axios.defaults.headers.common["Authorization"] = localStorage.token;
  } else {
    // 만료된 토큰은 삭제한다 
    delete localStorage.token;
  }
}

// Redux 초기 상태 설정
const initialState = {
  userName: userName,
  role: userRole
};

// Redux 스토어 생성
const store = createStore(rootReducer, initialState);

// React 애플리케이션 렌더링
root.render(
  <Suspense fallback={<Loader />}>
    <BrowserRouter> {/* BrowserRouter로 변경 */}
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </Suspense>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
