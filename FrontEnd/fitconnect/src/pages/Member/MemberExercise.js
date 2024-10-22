import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MemberExercise() {
    const [m_calendar_id, setMCalendarId] = useState(0);
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
        if(formattedDate){  // formattedDate 가 설정된 후에만 실행
            axios.get(`/exercisejournal/date/${formattedDate}`,{
                headers: {
                Authorization: localStorage.getItem('token')
                }
            })
            .then(res => {  
                const newMCalendarId = res.data.exerJournalList[0]?.m_calendar_id; // 옵셔널 체이닝으로 안전하게 접근
                setMCalendarId(newMCalendarId);
                // 응답 데이터가 정의되었는지 확인 후 상태 설정
                setExerJournal(res.data?.exerJournalList || []); // 옵셔널 체이닝 사용
            })
            .catch(error => {
                console.error(`exercise Journal 요청 실패`, error);
            })

        }
    }, [formattedDate]);


    const handleDeleteAll = () => {
        axios.delete(`/exercisejournal/calendar/${m_calendar_id}`)
            .then(res => {
                alert("운동일지가 삭제되었습니다.")
                navigate(0)
        
            })
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
        const formattedDate = date.toISOString().split("T")[0]
        navigate(`/member/exercisejournal`, {
            state: {
              regdate: formattedDate
            }})

    };


    //메인페이지에서 reserve / Delete 버튼을 보이지않게 하기 위한 설정
    const styleNone = location.pathname === "/member" ? {display:"none"} : {display:"flex"}
    const styleNone2 = location.pathname === "/member/exercisejournal" ? {display:"none"} : {display:"flex"}

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Header className="Header">
                        <h3 style={{marginBottom:15}}>{selectedDate.toLocaleDateString('ko-KR')}의 운동</h3>                 
                        { exercisejournal.length === 0 && (
                            <p>해당 일자의 운동 일지를 등록해 주세요
                           
                            </p>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                dateFormat="yyyy년 MM월 dd일"
                                placeholderText="날짜를 선택하세요"
                            />
                            <Button variant="dark"  onClick={handleReserve} style={styleNone2}>
                                등록
                            </Button>
                        </div>

                    </Card.Header>

                </Card>
            </Col>

            <Col md={48} lg={40}>
                <Card>
                    <Card.Header as="h6" className="border-bottom p-3 mb-0" style={styleNone}>
                        <div className="d-flex justify-content-end mb-3" style={{fontFamily:'nanumsquare', fontWeight:700}}>
                            <Button onClick={handleReserve} variant="secondary" className="me-2">등록하기</Button>
                            <Button onClick={handleDeleteAll} variant="secondary">전체 삭제</Button>
                        </div>
                    </Card.Header>

                    <Card.Body>
                        <Table bordered>
                            <thead className="text-center" style={{fontFamily:'nanumsquare', fontWeight:700}}>
                                <tr>
                                    <th>운동명</th>
                                    <th>무게</th>
                                    <th>횟수</th>
                                    <th>세트</th>
                                    <th>순서</th>
                                </tr>
                            </thead>
                            <tbody className="text-center" style={{fontFamily:'nanumsquare', fontWeight:700}}>
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