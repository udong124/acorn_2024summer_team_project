import React from 'react';

function TrainerGet(props) {
    return (
        <div>
            
        </div>
    );
}

// 이 컴포넌트는 admin만 접근 가능하도록 설정
TrainerGet.allowedRoles = ['admin'];


export default TrainerGet;