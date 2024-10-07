import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import userMainCss from './css/UserMain.module.css';
import binder from 'classnames/bind'
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';

const cx = binder.bind(userMainCss)

function UserStartPage() {
  //메인페이지에만 비디오 배경을 보여주게끔
  const location=useLocation();
  const navigate=useNavigate();

  const currentOutlet = useOutlet()

  useEffect(()=>{
    localStorage.setItem("token", "")
    localStorage.setItem("userName", "")
    localStorage.setItem("role", "")
  }, [])

  return (
    <div className="MainContainer">
      {location.pathname === "/" && (
      <div className='MainBackGround'>
        <video className={cx('video-background')} autoPlay loop muted>
          <source src={`${process.env.PUBLIC_URL}/health_main.mp4`} type='video/mp4' />
        </video>
        <div className={cx("overlay")}>
          <div className={cx("button-container")}>
            <Button onClick={() => navigate('/login')}>로그인</Button>
            <Button onClick={() => navigate('/signup')}>회원가입</Button>
          </div>
        </div>
      </div>
      )}
      <div className='maincontent'>{currentOutlet}</div>
    </div>
  );
}

export default UserStartPage;
