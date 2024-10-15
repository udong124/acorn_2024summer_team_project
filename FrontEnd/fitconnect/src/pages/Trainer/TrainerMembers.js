import axios from "axios";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router";


function Members() {
  const [members, setMembers] = useState([]);
  const [dietJournalModal, setDieJournalModal] = useState(false);
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
    }, []);
  

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
            console.log("/trainer/message?selectedTopic="+res.data.topic)
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

  // 회원목록 출력
  return (
    <div>
      <Row>
        <Col>
          <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0">
              회원 목록
            </Card.Header>
            <Card.Body>
              <ul>
                {members.map((item) => (
                  <div key={item.id}>
                    <img src={item.profile && item.profile !== null ? "http://52.78.38.12:8080/upload/"+item.profile : `/img/none.png`} alt={`${item.name} 프로필`} style={profileStyle}/>
                    <p>이름: {item.name}</p>
                    <p>키: {item.member_height}</p>
                    <p>몸무게: {item.member_weight}</p>
                    <p>성별: {item.member_gender}</p>
                    <p>플랜: {item.plan}</p>
                    <p>주간플랜: {item.weeklyplan}</p>

                      
                    {/* 새로운 채팅방 생성 버튼 */}
                    <Button variant='primary' onClick={() => getAndPost(item.id)}>대화하기</Button>
                    <Button>운동일지</Button>
                    <Button>식단목록</Button>
                    <Button variant='danger' onClick={() => handleDelete(item.id)}>회원삭제</Button>
                  </div>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Members;