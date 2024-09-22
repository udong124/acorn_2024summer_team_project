import React from 'react';

function UserDelete(props) {
    return (
        <div>
            
        </div>
    );
}

// 이 컴포넌트는 admin만 접근 가능하도록 설정
UserDelete.allowedRoles = ['admin'];

export default UserDelete;