import React from 'react';

function DietJournal(props) {
    return (
        <div>
            
        </div>
    );
}


// 이 컴포넌트는 member만 접근 가능하도록 설정
DietJournal.allowedRoles = ['member'];

export default DietJournal;