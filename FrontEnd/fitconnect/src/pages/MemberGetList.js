import React from 'react';

function MemberGetList(props) {
    return (
        <div>
            
        </div>
    );
}

// 이 컴포넌트는 trainer만 접근 가능하도록 설정
MemberGetList.allowedRoles = ['trainer'];

export default MemberGetList;