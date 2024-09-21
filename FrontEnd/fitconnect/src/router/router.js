import App from "../App"
import MemberSignUp from "../pages/MemberSignUp"
import TrainerSignUp from "../pages/TrainerSignUp"
import UserLogin from "../pages/UserLogin"
import UserSignUp from "../pages/UserSignUp"
import TrainerGetId from "../pages/TrainerGetId"

const { createBrowserRouter } = require("react-router-dom")

//라우트 정보를 배열에 저장
const routes=[
    {path:"/", element: <div>메인 페이지 입니다. 여기는 기본 App.js 화면입니다.</div>},
    {path:"/user", element: <UserSignUp/>},
    {path:"/auth", element: <UserLogin/>},
    {path:"/member", element: <MemberSignUp/>},
    {path:"/trainer", element: <TrainerSignUp/>},
    {path:"/member/update/trainer", element: <TrainerGetId/>}
    
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