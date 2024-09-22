import React from 'react';

function UserUpdate(props) {
    return (
        <div>
            
        </div>
    );
}

// 이 컴포넌트는 member와 trainer가 모두 접근 가능하도록 설정
UserUpdate.allowedRoles = ['member', 'trainer'];


export default UserUpdate;