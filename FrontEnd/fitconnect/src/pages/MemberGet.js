import React from 'react';

function MemberGet(props) {
    return (
        <div>
            
        </div>
    );
}

// 이 컴포넌트는 admin만 접근 가능하도록 설정
MemberGet.allowedRoles = ['admin'];


export default MemberGet;