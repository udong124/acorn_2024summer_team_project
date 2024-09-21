import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Header from './layout/Header';
import Footer from './layout/Footer';

import { Link, useLocation, useOutlet } from 'react-router-dom';


function App() {
  //메인페이지에만 비디오 배경을 보여주게끔
  const location=useLocation();

  const currentOutlet = useOutlet()

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
              <Link to="/user">사용자 회원가입</Link>
            </li>
            <li>
              <Link to="/auth">사용자 로그인</Link>
            </li>
            <li>
              <Link to="/member">회원 기본 설정</Link>
            </li>
            <li>
              <Link to="/trainer">트레이너 기본 설정</Link>
            </li>
            <li>
              <Link to="/member/update/trainer">트레이너 Id 검색</Link>
            </li>
            </ul>
          </nav>
          <div className='maincontent'>{currentOutlet}</div>
        <div className="Footer"><Footer/></div>
      </div>
  );
}

export default App;
