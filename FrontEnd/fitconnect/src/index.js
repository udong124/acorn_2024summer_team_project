import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import rootReducer from './reducers';

// src/router/router.js 를 import
import router from './router/router'
import { RouterProvider } from 'react-router-dom';
import axios from 'axios';


// token 이 존재 한다면 token 에서 값을 읽어와서 저장할 변수 만들기
let userName=null









  // reducer 함수를 전달하면서 store(저장소) 를 만든다
  const store=createStore(rootReducer);

  //id가 root 인 곳에 UI 출력하기
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router}/>
      </Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
