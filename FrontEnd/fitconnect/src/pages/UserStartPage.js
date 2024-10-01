import { Link, useLocation, useOutlet } from 'react-router-dom';


function UserStartPage() {
  //메인페이지에만 비디오 배경을 보여주게끔
  const location=useLocation();

  const currentOutlet = useOutlet()

  return (
    <div className="MainContainer">
      {location.pathname === "/" && (
      <div className='MainBackGround'>
      <video autoPlay loop muted>
        <source src={`${process.env.PUBLIC_URL}/health_main.mp4`} type='video/mp4' />
      </video>
      </div>
      )}
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
              <Link to="/login">사용자 로그인</Link>
            </li>
            <li>
              <Link to="/membersignup">회원 기본 설정</Link>
            </li>
            <li>
              <Link to="/trainersignup">트레이너 기본 설정</Link>
            </li>
            <li>
              <Link to="/trainerid">트레이너 검색기능</Link>
            </li>
            <li>
              <Link to="/googlelogin">구글연동로그인</Link>
            </li>
            </ul>
          </nav>
          <div className='maincontent'>{currentOutlet}</div>
      </div>
  );
}

export default UserStartPage;
