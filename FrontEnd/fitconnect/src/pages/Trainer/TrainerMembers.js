import axios from "axios";
import { useEffect, useState } from "react";
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
      .catch(err => console.log(err));
  };

  useEffect(() => {
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
    </div>
  );
}

export default Members;
