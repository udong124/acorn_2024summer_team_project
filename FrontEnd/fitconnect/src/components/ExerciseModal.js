import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Button, Row, Col, Table, Modal } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function ExerciseModal({ exerciseModal, setExerciseModal, member_num, name }) {
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
        console.log(formattedDate)
        setExerJournal([])
        axios.get(`/trainer/memberlist/exerjournal/${formattedDate}`,
            {
        params : {member_num : member_num }
            }
          )
        .then(res => {
        // 응답 데이터가 정의되었는지 확인 후 상태 설정
        setExerJournal(res.data?.exerJournalList || []); // 옵셔널 체이닝 사용
        console.log(exercisejournal)
        })
        .catch(error => {
            console.error(`exercise Journal 요청 실패`, error);
        })

        console.log(exercisejournal)
    }, [formattedDate]);




    const handleDateChange = (date) => {
        setSelectedDate(date); // 선택한 날짜 업데이트

        // 새로운 날짜 포맷으로 업데이트
        const updatedDate = new Date(date);
        const year = updatedDate.getFullYear();
        const month = ("0" + (updatedDate.getMonth() + 1)).slice(-2);
        const day = ("0" + updatedDate.getDate()).slice(-2);
        const newFormattedDate = `${year}-${month}-${day}`;

        setFormattedDate(newFormattedDate); // 새로운 형식화된 날짜 설정

    };



    return (

        <Modal show={exerciseModal} onHide={() => {
      setExerJournal([]);
      setExerciseModal(false);
    }}>
            <Modal.Header  as="h6" className="border-bottom p-3 mb-0">
                <p style={{fontSize: "1.5em", fontWeight: "bold"}}>{selectedDate.toLocaleDateString('ko-KR')}의 운동                        
                </p>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="yyyy년 MM월 dd일"
                        placeholderText="날짜를 선택하세요"
                    />
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
        </Modal>

    );
}

export default ExerciseModal;