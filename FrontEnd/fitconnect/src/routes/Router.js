import { element } from "prop-types";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

/********Layouts********/
const BaseLayout = lazy(() => import("../layouts/BaseLayout.js"));
const ProtectedRoute = lazy(() => import("../components/ProtectedRoute.js"));

/********* Pages *******/

/**** USER ****/
const UserStartPage = lazy(() => import("../pages/UserStartPage.js"));
const MemberSignUp = lazy(() => import("../pages/MemberSignUp.js"));
const TrainerSignUp = lazy(() => import("../pages/TrainerSignUp.js"));
const UserLogin = lazy(() => import("../pages/UserLogin.js"));
const UserSignUp = lazy(() => import("../pages/UserSignup.js"));
const TrainerId = lazy(() => import("../pages/TrainerId.js"));

/**** MEMBER ****/
const Starter = lazy(() => import("../pages/Starter.js"));
const MemberMyPage = lazy(() => import("../pages/MemberMyPage.js"));
const MemberCalendar = lazy(() => import("../pages/MemberCalendar.js"));
const MemberDietJournal = lazy(() => import("../pages/MemberDietJournal.js"));
const MemberDietAdd = lazy(() => import("../pages/MemberDietAdd.js"));
const MemberExercise = lazy(() => import("../pages/MemberExercise.js"));
const MemberExerciseAdd = lazy(() => import("../pages/MemberExerciseAdd.js"));

/**** TRAINER ****/
const Home = lazy(() => import("../pages/Home.js"));
const TrainerCalendar = lazy(() => import("../pages/TrainerCalendar.js"));
const TrainerMessage = lazy(() => import("../pages/TrainerMessage.js"));
const TrainerMembers = lazy(() => import("../pages/TrainerMembers.js"));
const TrainerMypage = lazy(() => import("../pages/TrainerMypage.js"));
const TrainerMypageDetail = lazy(() => import("../pages/TrainerMypageDetail.js"));


/********* Routes *******/
const Routes = [
  {
    path: "/",
    element: <BaseLayout />, // 모든 경로에 BaseLayout 사용
    children: [
      { path: "/", element: <Navigate to="/userstartpage" /> },
      { path: "/userstartpage", element: <UserStartPage /> },
      { path: "/login", element: <UserLogin /> },
      { path: "/signup", element: <UserSignUp /> },
      { path: "/trainersignup", element: <TrainerSignUp /> },
      { path: "/membersignup", element: <MemberSignUp /> },
      { path: "/trainerid", element: <TrainerId /> },

      // 멤버 관련 경로
      { path: "/mem", element: <Navigate to="/mem/starter" /> },
      { path: "/mem/starter", element: <Starter /> },
      { path: "/mem/MemberMyPage", element: <MemberMyPage /> },
      { path: "/mem/MemberCalendar", element: <MemberCalendar /> },
      { path: "/mem/MemberDietJournal", element: <MemberDietJournal /> },
      { path: "/mem/MemberDietAdd", element: <MemberDietAdd /> },
      { path: "/mem/MemberExerciseAdd", element: <MemberExerciseAdd /> },
      { path: "/mem/MemberExercise", element: <MemberExercise /> },

      // 트레이너 관련 경로
      { path: "/tr", element: <Navigate to="/tr/home" /> },
      { path: "/tr/home", element: <Home/> },
      { path: "/tr/calendar", element: <TrainerCalendar /> },
      { path: "/tr/message", element: <TrainerMessage/>},
      { path: "/tr/members", element: <TrainerMembers/>},
      { path: "/tr/mypage", element: <TrainerMypage/>},
      { path: "/tr/mypagedetail", element: <TrainerMypageDetail/>},
    ],
  },
];

export default Routes;

