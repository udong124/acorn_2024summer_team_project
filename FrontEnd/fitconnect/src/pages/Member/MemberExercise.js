import axios from "axios";
import { useEffect, useState } from "react";
import { Card,Button,Row,Col, Table, CardHeader} from "react-bootstrap";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * MemberExercise 컴포넌트
 * - 사용자가 운동 일지를 조회하거나 삭제할 수 있는 기능 제공
 * - 선택한 날짜의 운동 데이터를 표시 및 순서별 운동관리 가능
 * - 각 운동 데이터를 삭제하거나 전체 삭제 기능 제공
 */

function MemberExercise(){
    const {m_calendar_id, e_journal_id} = useParams()

    const navigate = useNavigate()//페이지 이동 및 쿼리파라미터 연관
    const location = useLocation()//쿼리파라미터의 위치정보를 담기위함
    const queryParams = new URLSearchParams(location.search)//URL 쿼리 파라미터

    //날짜 관련 및 아무런 날짜 받은게 없으면 현재날짜 기준으로 셋팅
    const today = new Date()
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const initialDateStr = queryParams.get("date") ? queryParams.get("date") : localDate
    const initialDate = new Date(initialDateStr)
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const [formData,setFormData]=useState([])

    const token = localStorage.getItem('token')

    //해당날짜 쿼리파라미터로 가져올때
    useEffect(()=>{
        console.log(queryParams.get)
        if(!queryParams.get("date")){
            const formattedDate = selectedDate.toISOString().split("T")[0];
            navigate(`?date=${formattedDate}`, { replace: true });
        }
    },[selectedDate, navigate, queryParams])

    //해당날짜에 대한 내용을 로딩하는거
    useEffect(()=>{
        axios.get(`/exercisejournal/${m_calendar_id}`)
        .then(res=>{
            axios.get(`/membercalendar/${m_calendar_id}`)
            .then(calendarRes=>{
                const selectDateCalendar = calendarRes.data.date
                const formattedSelectedDate = selectedDate.toISOString().split('T')[0];
                const filteredData = res.data.exerJournalList.filter(item => selectDateCalendar === formattedSelectedDate);
                setFormData(filteredData)})
            })
        .catch(error=>{console.log(error)})
    },[token, e_journal_id,selectedDate,m_calendar_id])

    //테이블에 있는 운동삭제
    const handleDelete= (exercise_id)=>{
        axios.delete(`/exercisejournal/${exercise_id}/${e_journal_id}`)
        .then((res)=>{
            if(res.data.isSuccess){
                const updatedSelect = formData.filter(item => item.exercise_id !== exercise_id)
                setFormData(updatedSelect)
            }else{
                console.log(res.data)
                alert("삭제실패")
            }
        })
        .catch(error=>{console.log(error)})
    }

    //전체삭제
    const handleDeleteAll = (m_calendar_id)=>{
        axios.delete(`/exercisejournal/${m_calendar_id}`)
        .then(res=>{ if(res.data.isSuccess)setFormData([]); Navigate('/mem/MemberCalendar')})
        .catch(error=>{console.log(error); alert("삭제실패")})
    }
    //수정버튼 클릭시 이동
    const handleReserve = () =>{
        navigate(`/member/exerciseadd/${m_calendar_id}/${e_journal_id}?date=${selectedDate.toISOString().split('T')[0]}`)
        //나중에 뒤에 번호 붙이는 그런걸로 바꿀
    }

    //날짜변경 핸들러. 선택한 날짜 업데이트되고, url 쿼리 파라미터도 같이 변경됨
    const handleDateChange = (date)=>{
        setSelectedDate(date)
        const formattedDate = date.toISOString().split("T")[0]
        queryParams.set("date",formattedDate)
        navigate(`?date=${formattedDate}`, { replace: true })
     }

return(
    <Row>
    <Col>
      <Card>
      <Card.Header as="h6" className="border-bottom p-3 mb-0">
        <h1>{selectedDate.toLocaleDateString('ko-KR')}의 운동</h1>
        <div style={{ marginBottom: "20px" }}>
                      <DatePicker
                      selected={selectedDate}  // 현재 선택된 날짜 설정
                      onChange={handleDateChange}  // 날짜 변경 시 handleDateChange 호출
                      dateFormat="yyyy년 MM월 dd일"  // 날짜 포맷 설정
                      placeholderText="날짜를 선택하세요"
                      />
        </div>
        </Card.Header>
      </Card>
    </Col>

    <Col md={48} lg={40}>
    <Card className="">
      <Card.Header as="h6" className="border-bottom p-3 mb-0">
            <div className="d-flex justify-content-end mb-3">
              <Button onClick={handleReserve} variant="secondary" className="me-2">reserve</Button>
              <Button onClick={handleDeleteAll} variant="secondary">Delete</Button>
            </div>
       </Card.Header>

        <Card.Body>
        <Table bordered >
            <thead className="text-center">
                <tr>
                    <th>운동명</th>
                    <th>무게</th>
                    <th>횟수</th>
                    <th>세트</th>
                    <th>순서</th>
                    <th>삭제 여부</th>
                </tr>
            </thead>
            <tbody className="text-center">
                {[...formData]
                    .sort((a, b) => a.exercise_order - b.exercise_order)
                    .map((data) => (
                        <tr key={data.exercise_id}> {/* e_journal_id 대신 exercise_id 사용 */}
                            <td>{data.exercise_name}</td>
                            <td>{data.exercise_weight}</td>
                            <td>{data.exercise_count}</td>
                            <td>{data.exercise_set}</td>
                            <td>{data.exercise_order}</td>
                            <td>
                                <Button onClick={() => handleDelete(data.exercise_id)} variant="outline-danger" >삭제</Button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
        </Card.Body>
      </Card>
    </Col>
  </Row>
  )
}

export default MemberExercise