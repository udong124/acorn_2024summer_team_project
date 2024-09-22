import App from "../App"
import ProtectedRoute from '../components/ProtectedRoute'
import MemberSignUp from "../pages/MemberSignUp"
import TrainerSignUp from "../pages/TrainerSignUp"
import UserLogin from "../pages/UserLogin"
import UserSignUp from "../pages/UserSignUp"
import UserGet from "../pages/UserGet"
import UserDelete from "../pages/UserDelete"
import UserUpdate from "../pages/UserUpdate"
import MemberCalendar from "../pages/MemberCalendar"
import MemberDelete from "../pages/MemberDelete"
import MemberGet from "../pages/MemberGet"
import MemberGetList from "../pages/MemberGetList"
import MemberUpdate from "../pages/MemberUpdate"
import TrainerCalendar from "../pages/TrainerCalendar"
import TrainerDelete from "../pages/TrainerDelete"
import TrainerGet from "../pages/TrainerGet"
import TrainerGetList from "../pages/TrainerGetList"
import TrainerUpdate from "../pages/TrainerUpdate"
import DietJournal from "../pages/DietJournal"
import DietList from "../pages/DietList"
import ExerciseJournal from "../pages/ExerciseJournal"
import ExerciseList from "../pages/ExerciseList"

const { createBrowserRouter } = require("react-router-dom")


/*   모르겠는 부분

다른 컴포넌트일 때 동일한 path를 가지고 있는 경우  매칭되는 하나의 컴포넌트만 화면에 렌더링되는 문제가 있음...
예를들어 UserSignUp.js 같은 경우 UserGet.js, UserDelete.js 와 path가 동일한데
화면에 UserSignUp.js가 갑자기 빈 화면으로 아예 안 나옴...  두개를 주석처리하면 또 화면에 나옴
같은 컴포넌트를 사용하더라도 경로는 고유해야 하는지.. ?
  */

/*
admin만 들어갈 수 있는 컴포넌트: UserDelete, UserGet, MemberDelete, MemberGet, TrainerDelete, TrainerGet

member만: MemberUpdate, TrainerGetList, MemberCalendar, ExerciseList, ExerciseJournal, DietList, DietJournal

trainer만: MemberGetList, TrainerUpdate, TrainerCalendar

member, trainer 공통으로 들어갈 수 있는 컴포넌트: UserUpdate

로그인 필요없는 컴포넌트: UserLogin, UserSignUp, UserMemberSignUp, UserTrainerSignUp

각 컴포넌트 하단에 allowedRoles를 적어놔서 해당 역할만 접근가능하게 함
*/ 


//라우트 정보를 배열에 저장
const routes=[
    {path:"/", element: <div>메인 페이지 입니다. 여기는 기본 App.js 화면입니다.</div>},
    {path:"/user", element: <ProtectedRoute><UserGet/></ProtectedRoute>},
    {path:"/user", element: <ProtectedRoute><UserDelete/></ProtectedRoute>},

    {path:"/user/update/info", element: <ProtectedRoute><UserUpdate/></ProtectedRoute>},
    {path:"/user/update/password", element: <ProtectedRoute><UserUpdate/></ProtectedRoute>},
    {path:"/user/update/role", element: <ProtectedRoute><UserUpdate/></ProtectedRoute>},

    {path:"/user", element: <UserSignUp/>},
    {path:"/auth", element: <UserLogin/>},

    {path:"/member", element: <MemberSignUp/>},

    {path:"/membercalendar", element: <ProtectedRoute><MemberCalendar/></ProtectedRoute>},
    {path:"/membercalendar/{m_calendar_id}", element: <ProtectedRoute><MemberCalendar/></ProtectedRoute>},
    
    {path:"/member", element: <ProtectedRoute><MemberDelete/></ProtectedRoute>},
    {path:"/member", element: <ProtectedRoute><MemberGet/></ProtectedRoute>},
    {path:"/member/list", element: <ProtectedRoute><MemberGetList/></ProtectedRoute>},
    {path:"/member/update/info", element: <ProtectedRoute><MemberUpdate/></ProtectedRoute>},
    {path:"/member/update/plan", element: <ProtectedRoute><MemberUpdate/></ProtectedRoute>},
    {path:"/member/update/trainer", element: <ProtectedRoute><MemberUpdate/></ProtectedRoute>},

    {path:"/member/update/trainer", element: <ProtectedRoute><TrainerGetList/></ProtectedRoute>},
    {path:"/trainer", element: <TrainerSignUp/>},

    {path:"/trainercalendar", element: <ProtectedRoute><TrainerCalendar/></ProtectedRoute>},
    {path:"/trainercalendar/{t_calendar_id}", element: <ProtectedRoute><TrainerCalendar/></ProtectedRoute>},
    {path:"/trainercalendar/list", element: <ProtectedRoute><TrainerCalendar/></ProtectedRoute>},
    {path:"/trainercalendar/detail", element: <ProtectedRoute><TrainerCalendar/></ProtectedRoute>},

    {path:"/trainer", element: <ProtectedRoute><TrainerDelete/></ProtectedRoute>},
    {path:"/trainer", element: <ProtectedRoute><TrainerGet/></ProtectedRoute>},
    {path:"/trainer/list", element: <ProtectedRoute><TrainerGetList/></ProtectedRoute>},
    {path:"/trainer/update/info", element: <ProtectedRoute><TrainerUpdate/></ProtectedRoute>},
    {path:"/trainer/update/gyminfo", element: <ProtectedRoute><TrainerUpdate/></ProtectedRoute>},
    
    {path:"/dietjournal/{m_calendar_id}", element: <ProtectedRoute><DietJournal/></ProtectedRoute>},
    {path:"/dietjournal/{d_calendar_id}", element: <ProtectedRoute><DietJournal/></ProtectedRoute>},

    {path:"/dietlist", element: <ProtectedRoute><DietList/></ProtectedRoute>},
    {path:"/dietlist/manager", element: <ProtectedRoute><DietList/></ProtectedRoute>},
    
    {path:"/exercisejournal", element: <ProtectedRoute><ExerciseJournal/></ProtectedRoute>},
    {path:"/exercisejournal/{e_journal_id}", element: <ProtectedRoute><ExerciseJournal/></ProtectedRoute>},
    {path:"/exercisejournal/{exercise_id}/{e_journal_id}", element: <ProtectedRoute><ExerciseJournal/></ProtectedRoute>},
    {path:"/exercisejournal/{m_calendar_id}", element: <ProtectedRoute><ExerciseJournal/></ProtectedRoute>},
    {path:"/dietjournal/all/{m_calendar_id}", element: <ProtectedRoute><ExerciseJournal/></ProtectedRoute>},

    {path:"/exerciselist", element: <ProtectedRoute><ExerciseList/></ProtectedRoute>},
    {path:"/exerciselist/{exercise_category}", element: <ProtectedRoute><ExerciseList/></ProtectedRoute>},
    {path:"/exerciselist/{exercise_id}", element: <ProtectedRoute><ExerciseList/></ProtectedRoute>},
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