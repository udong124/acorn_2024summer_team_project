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
    const queryParams = new URLSearchParams(location.search);

    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const initialDateStr = queryParams.get("date") ? queryParams.get("date") : localDate;
    const initialDate = new Date(initialDateStr);
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const [formData, setFormData] = useState([]);
    

    const token = localStorage.getItem('token');

    useEffect(() => {
        const formattedSelectedDate = selectedDate.toISOString().split("T")[0];

        axios.get(`/exercisejournal/date/${formattedSelectedDate}`)
            .then(res => {
                console.log(res.data) //뭐가 올까요
                setFormData(res.data)
            })
            .catch(error => {
                console.error(`exercise Journal 요청 실패`, error);
            })
    }, [selectedDate]);

   
    const handleDelete = (exercise_id) => {
        axios.delete(`/exercisejournal/${exercise_id}/${e_journal_id}`)
            .then((res) => {
                if (res.data.isSuccess) {
                    const updatedSelect = formData.filter(item => item.exercise_id !== exercise_id);
                    setFormData(updatedSelect);
                } else {
                    console.log(res.data);
                    alert("삭제실패");
                }
            })
            .catch(error => { console.log(error) });
    };

    const handleDeleteAll = (m_calendar_id) => {
        axios.delete(`/exercisejournal/${m_calendar_id}`)
            .then(res => { if (res.data.isSuccess) setFormData([]); navigate('/mem/MemberCalendar') })
            .catch(error => { console.log(error); alert("삭제실패") });
    };

    const handleReserve = () => {
        navigate(`/member/exerciseadd/${m_calendar_id}/${e_journal_id}?date=${selectedDate.toISOString().split('T')[0]}`);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = date.toISOString().split("T")[0];
        queryParams.set("date", formattedDate);
        navigate(`?date=${formattedDate}`, { replace: true });
    };

    //메인페이지에서 reserve / Delete 버튼을 보이지않게 하기 위한 설정
    const styleNone = location.pathname === "/member" ? {display:"none"} : {display:"flex"}

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Header as="h6" className="border-bottom p-3 mb-0">
                        <p style={{fontSize: "1.5rem", fontWeight: "bold"}}>{selectedDate.toLocaleDateString('ko-KR')}의 운동</p>
                        <div style={{ marginBottom: "20px", display:"none" }}>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                dateFormat="yyyy년 MM월 dd일"
                                placeholderText="날짜를 선택하세요"
                            />
                        </div>
                    </Card.Header>
                </Card>
            </Col>

            <Col md={48} lg={40}>
                <Card>
                    <Card.Header as="h6" className="border-bottom p-3 mb-0" style={styleNone}>
                        <div className="d-flex justify-content-end mb-3">
                            <Button onClick={handleReserve} variant="secondary" className="me-2">reserve</Button>
                            <Button onClick={handleDeleteAll} variant="secondary">Delete</Button>
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
                                {/* {[...formData]
                                    .sort((a, b) => a.exercise_order - b.exercise_order)
                                    .map((data) => (
                                        <tr key={data.exercise_id}>
                                            <td>{data.exercise_name}</td>
                                            <td>{data.exercise_weight}</td>
                                            <td>{data.exercise_count}</td>
                                            <td>{data.exercise_set}</td>
                                            <td>{data.exercise_order}</td>
                                        </tr>
                                    ))
                                } */}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default MemberExercise;