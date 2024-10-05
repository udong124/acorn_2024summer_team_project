import axios from "axios";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import { Card, Row, Col } from "react-bootstrap";

function Members() {
  const [members, setMembers] = useState([]);

  // 회원목록 가져오는 axios.get요청
  const getMembers = () => {
    axios.get(`/trainer/list/member`)
      .then(res => {
        console.log(res.data);
        setMembers(res.data);
      })
=======
import binder from 'classnames/bind'
import { Card,Row,Col} from "react-bootstrap";


// 해당 페이지 추가 되어야하는 내용
// 회원 캘린더 -> 회원 캘린더 내에서 운동일지 , 식단정보 클릭시 상세페이지 이동
// 회원 옆 버튼으로 회원 상세페이지 이동


function Members() {

  const [members, setMembers] = useState([
    // {
    //   member_num:'',
    //   name:'',
    //   profile_image_url:'',
    //   member_height:'',
    //   member_weight:'',
    //   member_gender:'',
    //   member_plan:'',
    // }
  ]); 

  // const [exerciseJournal, setExerciseJournal] = useState([]);
  // const [exerciseGoal, setExerciseGoal] = useState({
  //   exercise_id: '',
  //   exercise_name: '',
  //   exercise_set: '',
  //   exercise_count: '',
  //   exercise_order: '',
  //   exercise_weight: ''
  // });

  // const [dietJournal, setdietJournal ]= useState([]);


  // 회원목록 가져오는 axios.get요청
  const getMembers = () => {
    axios.get(`/trainercalendar`)
      .then(res => {
        console.log(res.data)
        setMembers(res.data)
  })
>>>>>>> af86f934149f75b6ce17b56d57aa1447563a3ba3
      .catch(err => console.log(err));
  };

  useEffect(() => {
<<<<<<< HEAD
    getMembers();
  }, []);

  // 회원을 목록에서 삭제하는 axios.patch
  const handleDelete = (id) => {
    console.log(id)
    axios.patch(`/member/update/trainer`, {
      id: id, // 전송할 회원 번호
      trainer_num: 0
    })
    .then(res => {
      console.log(res.data);
      // 성공적으로 삭제된 후, 로컬 상태에서 해당 회원을 제거
      setMembers(members.filter(member => member.id !== id));
    })
    .catch(err => console.log(err));
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
                    <button onClick={() => handleDelete(item.id)}>삭제</button>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
=======
    getMembers()
  }, []);

  // 회원을 목록에서 삭제하는 axios.delete 요청
  const handleDelete = (num) => {
    axios.delete(`/members/${num}`)
      .then(res => getMembers(res.data)) 
      .catch(err => console.log(err));
  };



  // 회원목록 출력
  return (
    <div>
    {/* <Row>
      <Col>
         <Card>
          <Card.Header as="h6" className="border-bottom p-3 mb-0">
            회원 목록
          </Card.Header>
          <Card.Body className="">
            <ul>
              {members.map(item => (
                <li key={item.member_num}>
                  {item.profile_image_url && <img src={item.profile_image_url} alt={`${item.name} 프로필`} />}
                  <p>이름: {item.name}</p>
                  <p>프로필 이미지: {item.profile_image_url}</p>
                  <p>키: {item.member_height}</p>
                  <p>몸무게: {item.member_weight}</p>
                  <p>성별: {item.member_gender}</p>
                  <p>플랜: {item.member_plan}</p>
                  <p>주간플랜: {item.weeklyplan}</p>
                  <button onClick={() => handleDelete(item.member_num)}>삭제</button>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      </Col>
    </Row>      */}
>>>>>>> af86f934149f75b6ce17b56d57aa1447563a3ba3
    </div>
  );
}

<<<<<<< HEAD
export default Members;
=======
export default Members;
>>>>>>> af86f934149f75b6ce17b56d57aa1447563a3ba3
