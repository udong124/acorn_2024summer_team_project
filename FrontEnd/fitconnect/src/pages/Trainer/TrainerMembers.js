import axios from "axios";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

function Members() {
  const [members, setMembers] = useState([]);


  const navigate = useNavigate();

    // 회원목록 가져오는 axios.get요청
    const getMembers = () => {
      axios.get(`/trainer/list/member`)
        .then(res => {
          console.log(res.data);
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
    console.log(member_num);
    axios.get(`/messenger`, { params: { member_num } })  
      .then(res => {
        console.log(res.data.topic)
        axios.get(`/messenger/detail/${res.data.topic}`)
        .then(detailRes =>{
          if (!detailRes.message_id) {
          console.log(detailRes.message_id)
          console.log("위에꺼")

        const firstMessage = {
          topic: res.data.topic,
          content: "채팅방이 개설되었습니다.",
          send_type: "ADMIN",
        };
        console.log(firstMessage)

        // 채팅방 생성 post 요청하기
        axios.post("/messenger/detail", firstMessage, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            console.log( response.data);
            navigate("/trainer/message?topic="+firstMessage.topic)
            
          })
          .catch(error => {
            console.error(error);
          });
        }else{
          alert("이미 채팅방이 존재합니다") 
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
      console.log(id)
      const formData = new FormData();
      formData.append('member_num', id); // member_num 추가
    
      // PUT 요청
      axios.put('/trainercalendar/detail', formData)
        .then(res => {
          console.log(res.data)
          getMembers(); // 삭제 후 회원 목록을 갱신
        })
        .catch(err => console.log(err));
    } else {
      console.log("삭제 취소됨");
    }
  };

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
                {members.map(item => (
                  <li key={item.id}>
                    {item.profile_image_url && <img src={item.profile_image_url} alt={`${item.name} 프로필`} />}
                    <p>이름: {item.name}</p>
                    <p>프로필 이미지: {item.profile_image_url}</p>
                    <p>키: {item.member_height}</p>
                    <p>몸무게: {item.member_weight}</p>
                    <p>성별: {item.member_gender}</p>
                    <p>플랜: {item.member_plan}</p>
                    <p>주간플랜: {item.weeklyplan}</p>

                      
                    {/* 새로운 채팅방 생성 버튼 */}
                    <Button variant='primary' onClick={() => getAndPost(item.id)}>채팅방 생성</Button>

                    <Button variant='danger' onClick={() => handleDelete(item.id)}>회원삭제</Button>
                  </li>
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