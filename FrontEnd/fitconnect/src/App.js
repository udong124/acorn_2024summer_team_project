import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Header from './layout/Header';
import Footer from './layout/Footer';

import { Link, Route, Routes, useLocation } from 'react-router-dom';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import MemberInfo from './pages/MemberInfo';
import TrainerInfo from './pages/TrainerInfo';
import Trainer from './pages/Trainer';



function App() {
//메인페이지에만 비디오 배경을 보여주게끔
const location=useLocation();

  return (
    <div className="MainContainer">
      {location.pathname === "/" && (
      <div className='MainBackGround'>
        <video autoPlay loop muted>
          <source src={`${process.env.PUBLIC_URL}/health_main.mp4`} type='video/mp4'/>
        </video>
      </div>
      )}
      <div className="Header"><Header/></div>
        <nav>
          {/* 링크 설정 */}
          <br/>
          <br/>
          <br/>
          <ul>
            <li>
              <Link to="/signup">사용자 회원가입</Link>
            </li>
            <li>
              <Link to="/auth">사용자 로그인</Link>
            </li>
            <li>
              <Link to="/memberInfo/{member_num}/setup">회원 기본 설정</Link>
            </li>
            <li>
              <Link to="/trainerInfo/{trainer_num}/setup">트레이너 기본 설정</Link>
            </li>
            <li>
              <Link to="/trainer/search">트레이너 검색기능</Link>
            </li>
            </ul>
          </nav>
        <Routes>
        <Route path="/" element={<div>메인 페이지 입니다. 여기는 기본 App.js 화면입니다.</div>} />
        <Route path="/auth" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/memberInfo/:member_num/setup" element={<MemberInfo />} />
        <Route path="/trainerInfo/:trainer_num/setup" element={<TrainerInfo />} />
        <Route path="/trainer/search" element={<Trainer />} />
        </Routes>
        <div className="Footer"><Footer/></div>
      </div>
  );
}

export default App;
