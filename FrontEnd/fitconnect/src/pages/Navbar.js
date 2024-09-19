import React from 'react';
import './css/Navbar.css';
import { NavLink } from 'react-router-dom';

function Navbar() {
    return (
      <nav className="navbar">
         <ul>
             <li><NavLink to="/">FitConnect</NavLink></li>
             <li className='mypage'><NavLink to="/Mypage">마이페이지</NavLink></li>
             <li className='logout'>로그아웃</li>
         </ul>
      </nav>
    );
}

export default Navbar;