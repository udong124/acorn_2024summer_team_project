import React from 'react';

function TrainerCalendar(props) {
    return (
        <div>
            
        </div>
    );
}

// 이 컴포넌트는 trainer만 접근 가능하도록 설정
TrainerCalendar.allowedRoles = ['trainer'];

export default TrainerCalendar;