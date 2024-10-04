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
      { path: "/trainerid", element: <TrainerId /> },
      { path: "/googlelogin", element: <GoogleLogin/>},

      // 멤버 관련 경로
      { path: "/member/*", element: <Navigate to="/member" /> },
      { path: "/member", element: <MemberMain /> },
      { path: "/member/mypage", element: <MemberMypage /> },
      { path: "/member/mypagedetail", element: <MemberMypageDetail /> },
      { path: "/member/trainerlist", element: <MemberTrainerList /> },
      { path: "/member/calendar", element: <MemberCalendar /> },
      { path: "/member/dietjournal/:m_calendar_id", element: <MemberDietJournal /> },
      { path: "/member/dietadd/:m_calendar_id/:d_journal_id", element: <MemberDietAdd /> },
      { path: "/member/exercise/:m_calendar_id", element: <MemberExercise /> },
      { path: "/member/exerciseadd/:m_calendar_id/:e_journal_id", element: <MemberExerciseAdd /> },

      // 트레이너 관련 경로
      { path: "/trainer/*", element: <Navigate to="/trainer" /> },
      { path: "/trainer", element: <TrainerMain/> },
      { path: "/trainer/calendar", element: <TrainerCalendar /> },
      { path: "/trainer/message", element: <TrainerMessage/>},
      { path: "/trainer/members", element: <TrainerMembers/>},
      { path: "/trainer/mypage", element: <TrainerMypage/>},
      { path: "/trainer/mypagedetail", element: <TrainerMypageDetail/>},

      // 관리자 관련 경로
      { path: "/admin/*", element: <Navigate to="/admin" /> },
      { path: "/admin", element: <AdminMain/> }
    ],
  },
];

export default Routes;

