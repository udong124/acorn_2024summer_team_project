import React from 'react';
import './css/Sidebar.css'
import { NavLink } from 'react-router-dom';


function Sidebar() {
    return (
        <div className='sidebar'>
            <ul>
                <li><NavLink to="/calendar" >캘린더</NavLink></li>
                <li><NavLink to="/message">메세지</NavLink></li>
                <li><NavLink to="/members">회원목록</NavLink></li>
            </ul>

        </div>
    );
}

export default Sidebar;