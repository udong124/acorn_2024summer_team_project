
import App from "../App"
import Home from "../pages/Home"
import TrainerCalendar from "../pages/TrainerCalendar"
import TrainerMessage from "../pages/TrainerMessage"
import TrainerMembers from "../pages/TrainerMembers"
import TrainerMypage from "../pages/TrainerMypage"
import TrainerMypageDetail from "../pages/TrainerMypageDetail"
const { createBrowserRouter } = require("react-router-dom")

//라우트 정보를 배열에 저장
const routes=[
    {path:"/", element: <Home/>},
    {path:"/trainer/calendar", element: <TrainerCalendar/>},
    {path:"/trainer/message", element: <TrainerMessage/>},
    {path:"/trainer/members", element: <TrainerMembers/>},
    {path:"/trainer/mypage", element: <TrainerMypage/>},
    {path:"/trainer/mypagedetail", element: <TrainerMypage/>}
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