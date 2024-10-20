import axios from "axios";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import DietModal from "../../components/DietModal";
import ExerciseModal from "../../components/ExerciseModal";
import './css/TrainerMember.css'
import { useNavigate } from 'react-router-dom';


let member_num;

function Members() {
  const [members, setMembers] = useState([]);
  const [dietModal, setDietModal] = useState(false);
  const [exerciseModal, setExerciseModal] = useState(false);



  const navigate = useNavigate();


    // 회원목록 가져오는 axios.get요청
    const getMembers = () => {
      axios.get(`/trainer/list/member`)
        .then(res => {
          setMembers(res.data);
        })
        .catch(err => console.log(err));
    };


    useEffect(() => {
      getMembers();
    }, [members]);
  

  // 반복문으로 출력한 id(member_num) 값으로 topic값 가져오기
  const getAndPost = (id) => {
    const member_num = id;
   
    axios.get(`/messenger`, { params: { member_num } })  
      .then(res => {
      
        axios.get(`/messenger/detail/${res.data.topic}`)
        .then(detailRes =>{
          //대화 메세지가 있는지 여부
          const isExist = detailRes.data.msgAll.length > 0
          if (!isExist) {
            const firstMessage = {
              topic: res.data.topic,
              content: "채팅방이 개설되었습니다.",
              send_type: "ADMIN",
            };
          
            // 채팅방 생성 post 요청하기
            axios.post("/messenger/detail", firstMessage, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then(response => {  
              navigate("/trainer/message?selectedTopic="+firstMessage.topic)
            })
            .catch(error => {
              console.error(error);
            });
          }else{
            navigate("/trainer/message?selectedTopic="+res.data.topic)
          }
      })
      .catch(err => {
        console.error( err);
      });
    })
  };

  


  const handleDelete = (id) => {
    const confirmDelete = window.confirm("정말로 이 회원을 삭제하시겠습니까?");
    
    if (confirmDelete) {
      const formData = new FormData();
      formData.append('member_num', id); // member_num 추가
    
      // PUT 요청
      axios.put('/trainercalendar/detail', formData)
        .then(res => {
         
          getMembers(); // 삭제 후 회원 목록을 갱신
        })
        .catch(err => console.log(err));
    } else {
      console.log("삭제 취소됨");
    }
  };


  const profileStyle={
    width: "200px",
    height: "200px",
    border: "1px solid #cecece",
    borderRadius: "50%",
    objectFit: "cover"
  }



  const handleExModal = (id)=>{
    member_num=id
    setExerciseModal(true)
  }

  const handleDiModal = (id)=>{
    member_num=id
    setDietModal(true)
  }


  // 회원목록 출력
  return (
    <div>
      <Row>
        <Col>
          <Card>
            <Card.Header className="Header">
              회원 목록
            </Card.Header>
            <Card.Body>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {members.map((item) => (
                  <li  className="row-container" key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #ccc',
                    padding: '10px'
                  }}>
                    
                    <Col  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={item.profile && item.profile !== null ? "http://52.78.38.12:8080/upload/" + item.profile : '/img/none.png'} 
                        alt={`${item.name} 프로필`} 
                        style={profileStyle} 
                      />
                      </Col>
                      <div className="membercontent">
                      <Col style={{ paddingLeft: "50px"}}>
                        <p>이름: {item.name}</p>
                        <p>키: {item.member_height}</p>
                        <p>몸무게: {item.member_weight}</p>
                        <p>성별: {item.member_gender}</p>
                        <p>플랜: {item.plan}</p>
                        <p>주간플랜: {item.weeklyplan}</p>                        
                      </Col>
                      </div>

                      {/* 새로운 채팅방 생성 버튼 */}
                      <Col style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'end' }}>
                        <div className="link-container">
                          <a href="#" onClick={() => getAndPost(item.id)} >대화하기</a>
                          <a href="#" onClick={() => handleExModal(item.id)}>운동일지</a>
                          <a href="#" onClick={() => handleDiModal(item.id)}>식단목록</a>
                          <a href="#" onClick={() => handleDelete(item.id)}>회원삭제</a>                    
                        </div>
                      </Col>

                    
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <DietModal
        dietModal={dietModal}
          setDietModal={setDietModal}
          member_num={member_num}
      />
      <ExerciseModal
        exerciseModal={exerciseModal}
        setExerciseModal={setExerciseModal}
        member_num={member_num}
      />
    </div>
  );
}

export default Members;