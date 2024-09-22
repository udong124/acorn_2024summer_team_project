import React from 'react';

function ExerciseJournal(props) {
    return (
        <div>
            
        </div>
    );
}

// 이 컴포넌트는 member만 접근 가능하도록 설정
ExerciseJournal.allowedRoles = ['member'];

export default ExerciseJournal;