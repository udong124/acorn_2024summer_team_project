import React from 'react';
import './css/navbar.css';
import { NavLink} from 'react-router-dom';

function Navbar() {


  const handleLogout = ()=>{
    delete localStorage.token

  }


    return (
      <nav className="navbar">
         <ul>
             <li className='logo'><NavLink to="/">Fit Connect</NavLink></li>
             <li className='message'><NavLink to="/Message">메신저</NavLink></li>
             <li className='members'><NavLink to="/Members">회원목록</NavLink></li>
             <li className='calendar'><NavLink to="/Calendar">캘린더</NavLink></li>
             <li className='mypage'><NavLink to="/Mypage">마이페이지</NavLink></li>
             <li className='logout' onClick={handleLogout}><NavLink to="/">로그아웃</NavLink></li>
         </ul>
      </nav>
    );
}

export default Navbar;