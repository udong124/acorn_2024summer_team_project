import React from 'react';
import './css/Navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {

  const navigate = useNavigate()

  const handleLogout = ()=>{
    delete localStorage.token
    navigate("/")
  }


    return (
      <nav className="navbar">
         <ul>
             <li><NavLink to="/">Fit Connect</NavLink></li>
             <li className='mypage'><NavLink to="/Message">메신저</NavLink></li>
             <li className='mypage'><NavLink to="/Members">회원목록</NavLink></li>
             <li className='mypage'><NavLink to="/Calendar">캘린더</NavLink></li>
             <li className='mypage'><NavLink to="/Mypage">마이페이지</NavLink></li>
             <li className='logout' onClick={handleLogout}>로그아웃</li>
         </ul>
      </nav>
    );
}

export default Navbar;