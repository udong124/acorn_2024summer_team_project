// src/store/reducers/modalReducer.js

const initialState = {
    show: false,
    message: '',
    url: ''
};

const modalReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_MODAL":
        case "ACCESS_DENIED_MODAL":
            return {
                ...state,
                show: action.payload.show,
                message: action.payload.message,
                url: action.payload.url
            };
        case "HIDE_MODAL":
            return initialState; // 모달 닫기
        default:
            return state;
    }
};

export default modalReducer;