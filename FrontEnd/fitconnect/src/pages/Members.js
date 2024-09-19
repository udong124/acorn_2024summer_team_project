// src/pages/Member.js


import axios from "axios";
import { useEffect, useState } from "react";



function Members() {
  const [members, setMembers] = useState([]); // 서버에서 받아온 회원목록을 저장하는 state
 
  // 서버에서 회원 데이터를 가져오는 함수
  const refresh = ()=>{

      axios.get('/members')  // API 경로
        .then(res=>setMembers(res.data))  
        .catch (err=>console.log('err'))
  }

  // 삭제 버튼을 눌렀을때 호출되는 함수
  const handleDelete = (num)=>{
    axios.delete('/members/'+num)
    .thent(res=>{
        refresh()
    })
    .catch(err=>console.console.log(err))
  }

  useEffect(()=>{
    refresh()
  }, [])
  
  useEffect(()=>{
    //해당 component 에서 필요한 준비 작업을 여기서 하면된다. 
    refresh()
}, [])

  return (
    <div>
      <h1>회원 목록</h1>
      <ul>
        {members.map(item => (
          <li key={item.member_num}>
            <p>이름: {item.name}</p>
            <p>프로필이미지: {item.profile_image_url}</p>
            <p>키: {item.member_height}</p>
            <p>몸무게 {item.member_weight}</p>
            <p>성별: {item.member_gender}</p>
            <p>플랜: {item.plan}</p>
            <button onClick={() => handleDelete(item.member_num)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default Members;