import React from 'react';

function UserGet(props) {
    return (
        <div>
            
        </div>
    );
}

// 이 컴포넌트는 admin만 접근 가능하도록 설정
UserGet.allowedRoles = ['admin'];


export default UserGet;