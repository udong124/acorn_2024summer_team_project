import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './css/Mypage.css';
import { Card } from 'react-bootstrap';

const MyPage = () => {
  const [trainerInfo, setTrainerInfo] = useState({
    trainer_num: '',
    name:'',
    user_id: '',
    email: '',
    trainer_created_at: '',
    profile_image_url: '',
    trainer_insta: '',
    trainer_intro: '',
    gym_name: '',
    gym_link: ''
  });

  useEffect(() => {
    axios.get('/trainer')
      .then(res => setTrainerInfo(res.data))
      .catch(err => console.log(err));
  }, []);

  // const imgRef = useRef();

  // const saveImgFile = () => {
  //   const file = imgRef.current.files[0];
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     setTrainerInfo(prevState => ({
  //       ...prevState, 
  //       profile_image_url: reader.result
  //     }));
  //   };
  // };

  return (
    <div>
      <h1>Mypage</h1>
      <Card style={{ width: '18rem'}} className='myPageLeft'>
        <Card.Header></Card.Header>
        <Card.Body>
          <div className='myPage_left'>
            <p><img src="{trainerInfo.profile_image_url}" alt="" /></p>
              <p>이름: {trainerInfo.name}</p>
              <p>자기소개: {trainerInfo.trainer_intro}</p>
          </div>
        </Card.Body>
       </Card>
       <Card>
        <Card.Body>
          <div className='myPageRight'>
              <p>고유 인식번호: {trainerInfo.trainer_num}</p>
              <p>아이디: {trainerInfo.user_id}</p>
              <p>이메일: {trainerInfo.email}</p>
              <p>생성일: {trainerInfo.trainer_created_at}</p>
              <p>이름: {trainerInfo.name}</p>
              <p>트레이너 SNS: {trainerInfo.trainer_insta}</p>

              <p>헬스장이름: {trainerInfo.gym_name}</p>
              <p>헬스장위치: {trainerInfo.gym_link}</p>
              
            </div>
          </Card.Body>
       </Card>

      {/* {trainerInfo.profile_image_url && (
        <img
          src={trainerInfo.profile_image_url}
          alt="프로필 이미지"
        />
      )}
      <form>
        <label className="signup-profileImg-label" htmlFor="profileImg">프로필 이미지 추가</label>
        <input
          className='signup-profileImg-input'
          type="file"
          accept="image/*"
          id="profileImg"
          onChange={saveImgFile}
          ref={imgRef}
        />
      </form> */}
    </div>
  );
};

export default MyPage;
