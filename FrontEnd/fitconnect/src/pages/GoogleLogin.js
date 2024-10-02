import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { decodeToken } from "jsontokens";


const GoogleLogin = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const token = queryParams.get('token');
  const id = queryParams.get('id');
  const role = queryParams.get('role');

  useEffect(()=>{
    localStorage.token = "Bearer+" + token.slice(7);
    if(step === 1) {
      axios
      .patch("/user/update/role", { id, role: selectedRole })
      .then((res) => {
        console.log(res.data)
        setStep(2)
      })
      .catch((error) => {
        console.error("역할 업데이트 중 오류 발생:", error);
        alert("역할 업데이트에 실패했습니다. 다시 시도해주세요.");
      });
    }
    else if(step === 2){
      // 선택한 역할대로 회원정보등록 페이지로 이동하기
      if (selectedRole === "MEMBER") {
        navigate("/membersignup", {
          state: {
            member_num: id
          }
        });
      } else if (selectedRole === "TRAINER") {
        navigate("/trainersignup", {
          state: {
            trainer_num: id
          }
        });
      }
    }

  }, [step])

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRole) {
      alert("역할을 선택해주세요.");
      return;
    }
    setStep(1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>역할을 선택해주세요</h2>
      <div>
        <label>
          <input
            type="radio"
            value="MEMBER"
            checked={selectedRole === "MEMBER"}
            onChange={handleRoleChange}
          />
          회원
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            value="TRAINER"
            checked={selectedRole === "TRAINER"}
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
