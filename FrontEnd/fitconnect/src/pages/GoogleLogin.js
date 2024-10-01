import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "jsontokens";


const GoogleLogin = ({ username }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

 useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) return;

    try {
      const {payload} = decodeToken(token.substring(7));
      if(payload) {
        const { providerid } = payload;
        setUserName(providerid);
      }
    } catch (error) {
      console.error("토큰 처리 중 오류:", error);
    }
  }, []);



  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) {
      alert("역할을 선택해주세요.");
      return;
    }
    axios
      .patch("/user/update/role", { username, role: selectedRole })
      .then(() => {
        // 선택한 역할대로 회원정보등록 페이지로 이동하기
        if (selectedRole === "member") {
          navigate("/membersignup");
        } else if (selectedRole === "trainer") {
          navigate("/trainersignup");
        }
      })
      .catch((error) => {
        console.error("역할 업데이트 중 오류 발생:", error);
        alert("역할 업데이트에 실패했습니다. 다시 시도해주세요.");
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>역할을 선택해주세요</h2>
      <div>
        <label>
          <input
            type="radio"
            value="member"
            checked={selectedRole === "member"}
            onChange={handleRoleChange}
          />
          회원
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="trainer"
            checked={selectedRole === "trainer"}
            onChange={handleRoleChange}
          />
          트레이너
        </label>
      </div>
      <button type="submit">계속</button>
    </form>
  );
};
export default GoogleLogin;
