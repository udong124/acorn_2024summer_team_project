
import App from "../App"
import Home from "../pages/Home"
import Calendar from "../pages/Calendar"
import Message from "../pages/Message"
import Members from "../pages/Members"
import Mypage from "../pages/Mypage"
import MypageDetail from "../pages/MypageDetail"
const { createBrowserRouter } = require("react-router-dom")

//라우트 정보를 배열에 저장
const routes=[
    {path:"/", element: <Home/>},
    {path:"/calendar", element: <Calendar/>},
    {path:"/message", element: <Message/>},
    {path:"/members", element: <Members/>},
    {path:"/mypage", element: <Mypage/>},
    {path:"/mypagedetail", element: <MypageDetail/>}
]

//BrowserRouter 를 만들기
const router = createBrowserRouter([{
    path:"/",
    element:<App/>,
    children: routes.map((route)=>{
        return {
            index: route.path === "/", //자식의 path 가 "/" 면 index 페이지 역활을 하게 하기 
            path: route.path === "/" ? undefined : route.path, // path 에 "/" 두개가 표시되지 않게  
            element: route.element //어떤 컴포넌트를 활성화 할것인지 
        }
    })
}])

// import 한 곳에 router(BrowserRouter) 를 사용하도록 
export default router