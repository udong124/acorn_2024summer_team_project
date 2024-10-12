import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MemberExercise() {
    const [m_calendar_id, setMCalendarId] = useState(null);
    const [e_journal_id, setEJournalId] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { regdate }= location.state || {};

    // 오늘 날짜
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // location 넘어올 경우 날짜
    const initialDateStr = regdate ? regdate : localDate;
    const initialDate = new Date(initialDateStr);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [formattedDate, setFormattedDate] = useState();

    const [exercisejournal, setExerJournal] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        //selectedDate에서 년월일 추출하는 식
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2); // 월을 두 자리 숫자로 만들기
        const day = ("0" + date.getDate()).slice(-2);
        setFormattedDate(`${year}-${month}-${day}`);
    }, [selectedDate])

    useEffect(() => {
        setExerJournal([])
        axios.get(`/exercisejournal/date/${formattedDate}`)
        .then(res => {
            setExerJournal(res.data.exerJournalList)
        })
        .catch(error => {
            console.error(`exercise Journal 요청 실패`, error);
        })
    }, [formattedDate]);


    const handleDeleteAll = () => {
        axios.delete(`/exercisejournal/${formattedDate}`)
            .then(res => { })
            .catch(error => { console.log(error); alert("삭제실패") });
    };

    const handleReserve = () => {
        navigate(`/member/exerciseadd`, {
            state: {
              regdate: formattedDate
            }
        })
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        navigate(`/member/exercisejournal`, {
            state: {
              regdate: formattedDate
            }
        })

    };

    //메인페이지에서 reserve / Delete 버튼을 보이지않게 하기 위한 설정
    const styleNone = location.pathname === "/member" ? {display:"none"} : {display:"flex"}

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Header as="h6" className="border-bottom p-3 mb-0">
                        <p style={{fontSize: "1.5em", fontWeight: "bold"}}>{selectedDate.toLocaleDateString('ko-KR')}의 운동</p>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy년 MM월 dd일"
                            placeholderText="날짜를 선택하세요"
                        />
                    </Card.Header>

                </Card>
            </Col>

            <Col md={48} lg={40}>
                <Card>
                    <Card.Header as="h6" className="border-bottom p-3 mb-0" style={styleNone}>
                        <div className="d-flex justify-content-end mb-3">
                            <Button onClick={handleReserve} variant="secondary" className="me-2">등록하기</Button>
                            <Button onClick={handleDeleteAll} variant="secondary">전체 삭제</Button>
                        </div>
                    </Card.Header>

                    <Card.Body>
                        <Table bordered>
                            <thead className="text-center">
                                <tr>
                                    <th>운동명</th>
                                    <th>무게</th>
                                    <th>횟수</th>
                                    <th>세트</th>
                                    <th>순서</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {(exercisejournal !== undefined) && exercisejournal.map(item => (
                                        <tr key={item.exercise_id}>
                                            <td>{item.exercise_name}</td>
                                            <td>{item.exercise_weight}</td>
                                            <td>{item.exercise_count}</td>
                                            <td>{item.exercise_set}</td>
                                            <td>{item.exercise_order}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default MemberExercise;