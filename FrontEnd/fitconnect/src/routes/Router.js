import { Navigate } from "react-router-dom";

import BaseLayout from './../layouts/BaseLayout';
import UserMain from '../pages/User/UserMain';
import UserLogin from '../pages/User/UserLogin';
import UserSignUp from '../pages/User/UserSignUp';
import TrainerSignUp from '../pages/User/TrainerSignUp';
import MemberSignUp from '../pages/User/MemberSignUp';
import TrainerId from '../pages/User/TrainerId';
import GoogleLogin from '../pages/User/GoogleLogin';
import MemberMain from '../pages/Member/MemberMain';
import MemberMypage from '../pages/Member/MemberMypage';
import MemberMypageDetail from '../pages/Member/MemberMypageDetail';
import MemberTrainerList from '../pages/Member/MemberTrainerList';
import MemberCalendar from '../pages/Member/MemberCalendar';
import MemberDietJournal from '../pages/Member/MemberDietJournal';
import MemberDietAdd from '../pages/Member/MemberDietAdd';
import MemberExerciseAdd from '../pages/Member/MemberExerciseAdd';
import MemberExercise from '../pages/Member/MemberExercise';
import TrainerCalendar from '../pages/Trainer/TrainerCalendar';
import TrainerMessage from '../pages/Trainer/TrainerMessage';
import TrainerMembers from '../pages/Trainer/TrainerMembers';
import TrainerMypage from '../pages/Trainer/TrainerMypage';
import TrainerMypageDetail from '../pages/Trainer/TrainerMypageDetail';
import TrainerMain from '../pages/Trainer/TrainerMain';
import AdminMain from '../pages/Admin/AdminMain';
import ProtectedRoute from "../components/ProtectedRoute";

 //ProtectedRoute 사용할 경우 이 주석을 이용해 감싸서 사용해주기  MEMBER,TRAINER,ADMIN 대문자로!
 // 예시: <ProtectedRoute allowedRoles={['ADMIN']}><TrainerId/></ProtectedRoute>

/********* Routes *******/
const Routes = [
  {
    path: "/",
    element: <BaseLayout />, // 모든 경로에 BaseLayout 사용
    children: [
      { path: "*", element: <Navigate to="/" /> },
      { path: "/", element: <UserMain /> },
      { path: "/login", element: <UserLogin /> },
      { path: "/signup", element: <UserSignUp/> },
      { path: "/trainersignup", element: <TrainerSignUp /> },
      { path: "/membersignup", element: <MemberSignUp /> },
      { path: "/trainerid", element: <ProtectedRoute allowedRoles={['MEMBER']}><TrainerId /></ProtectedRoute> },
      { path: "/googlelogin", element: <GoogleLogin/>},

      // 멤버 관련 경로
      { path: "/member/*", element: <Navigate to="/member" /> },
      { path: "/member", element: <ProtectedRoute allowedRoles={['MEMBER']}><MemberMain /></ProtectedRoute> },
      { path: "/member/mypage", element: <ProtectedRoute allowedRoles={['MEMBER']}><MemberMypage /></ProtectedRoute> },
      { path: "/member/mypagedetail", element: <ProtectedRoute allowedRoles={['MEMBER']}><MemberMypageDetail /></ProtectedRoute> },
      { path: "/member/trainerlist/:member_num", element: <ProtectedRoute allowedRoles={['MEMBER']}><MemberTrainerList /></ProtectedRoute> },
      { path: "/member/calendar", element: <ProtectedRoute allowedRoles={['MEMBER']}><MemberCalendar /></ProtectedRoute> },
      { path: "/member/dietjournal", element: <ProtectedRoute allowedRoles={['MEMBER']}><MemberDietJournal /></ProtectedRoute> },
      { path: "/member/dietadd", element: <ProtectedRoute allowedRoles={['MEMBER']}><MemberDietAdd /></ProtectedRoute> },
      { path: "/member/exercise", element: <ProtectedRoute allowedRoles={['MEMBER']}><MemberExercise /></ProtectedRoute> },
      { path: "/member/exerciseadd", element: <ProtectedRoute allowedRoles={['MEMBER']}><MemberExerciseAdd /></ProtectedRoute> },

      // 트레이너 관련 경로
      { path: "/trainer/*", element: <Navigate to="/trainer" /> },
      { path: "/trainer", element: <ProtectedRoute allowedRoles={['TRAINER']}><TrainerMain/></ProtectedRoute> },
      { path: "/trainer/calendar", element: <ProtectedRoute allowedRoles={['TRAINER']}><TrainerCalendar /></ProtectedRoute> },
      { path: "/trainer/message", element: <ProtectedRoute allowedRoles={['TRAINER']}><TrainerMessage/></ProtectedRoute>},
      { path: "/trainer/members", element: <ProtectedRoute allowedRoles={['TRAINER']}><TrainerMembers/></ProtectedRoute>},
      { path: "/trainer/mypage", element: <ProtectedRoute allowedRoles={['TRAINER']}><TrainerMypage/></ProtectedRoute>},
      { path: "/trainer/mypagedetail", element: <ProtectedRoute allowedRoles={['TRAINER']}><TrainerMypageDetail/></ProtectedRoute>},

      // 관리자 관련 경로
      { path: "/admin/*", element: <Navigate to="/admin" /> },
      { path: "/admin", element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminMain/></ProtectedRoute> }
    ],
  },
];

export default Routes;
