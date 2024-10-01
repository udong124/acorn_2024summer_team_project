import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { decodeToken } from 'jsontokens';

function GoogleUser() {
    const [role, setRole] = useState("");
    const [userName, setUserName] = useState("");
    const [providerid, setProviderid] = useState("");

    useEffect(() => {
        // localStorage에서 토큰을 가져와 확인
        const token = localStorage.getItem('token');
        if (!token) return;
    
        try {
          const { payload } = decodeToken(token.substring(7)); 
          if (payload) {
            const { providerid } = payload;
            setUserName(providerid); // 구글 ID를 userName로 설정
          }
        } catch (error) {
          console.error("토큰 처리 중 오류:", error);
        }
      }, []);

    const handleButton = (e) => {
        e.preventDefault();

        axios
        .patch("/user/update/role", { userName, role})
        .then
        .catch((error) => {
            if(error.response && error.response.data) {
                console.error("역할 등록 실패:",
                    error.response.data.message
                  );
            }
        }
    )}



    return (
        <Form>
            <br/>
            <div style={{ marginTop: '200px', textAlign: 'center' }}>
            <Button variant='primary' size='lg' as={Link} to="/membersignup">회원용 회원가입</Button>
            <div>또는</div>
            <Button variant='secondary' size='lg' as={Link} to="/trainersignup">트레이너용 회원가입</Button>
            </div>
        </Form>
    );
}

export default GoogleUser;