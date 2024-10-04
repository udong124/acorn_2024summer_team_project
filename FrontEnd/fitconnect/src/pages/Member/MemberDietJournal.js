import axios from "axios"
import React, { useEffect, useState } from "react"
import { Button, Card, Row, Col } from "react-bootstrap"
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * MemberDietJournal 컴포넌트
 * - 사용자의 식단 일지를 조회하고 삭제할 수 있는 기능을 제공
 * - 선택한 날짜의 식단 데이터를 표시 및 탄수화물, 단백질, 지방, 칼로리의 총합 표시
 */

function MemberDietJournal(){
  // URL 파라미터에서 member_num, m_calendar_id, d_journal_id 추출
  const {member_num, m_calendar_id, d_journal_id} = useParams()

  const [formData,setFormData] = useState([])// 조회된 식단데이터
  const [totalCarbs, setTotalCarbs] = useState(0)//총 탄수화물
  const [totalProtein, setTotalProtein] = useState(0)//총 단백질
  const [totalFat, setTotalFat] = useState(0)//총 지방
  const [totalKcal, setTotalKcal] = useState(0)//총 칼로리

  const token = localStorage.getItem('token')
  
  const navigate = useNavigate()//페이지 이동 및 쿼리파라미터 연관
  const location = useLocation()//쿼리파라미터의 위치정보를 담기위함
  const queryParams = new URLSearchParams(location.search)//URL 쿼리 파라미터

  //날짜 관련 및 아무런 날짜 받은게 없으면 현재날짜 기준으로 셋팅
  const today = new Date()
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const initialDateStr = queryParams.get("date") ? queryParams.get("date") : localDate
  const initialDate = new Date(initialDateStr)
  const [selectedDate, setSelectedDate] = useState(initialDate);

  //해당날짜 쿼리파라미터로 가져올때
  useEffect(()=>{
    if(!queryParams.get("date")){
        const formattedDate = selectedDate.toISOString().split("T")[0];
        navigate(`?date=${formattedDate}`, { replace: true });
    }
  },[selectedDate, navigate, queryParams])

  //해당날짜에 대한 내용을 로딩
  useEffect(()=>{
    axios.get(`/dietjournal/${m_calendar_id}`)
    .then(res => {
      axios.get(`/membercalendar/${m_calendar_id}`)
      .then(calendarRes=>{
        const selectDateCalendar = calendarRes.data.date
        const formattedSelectedDate = selectedDate.toISOString().split('T')[0];
        const filteredData = res.data.list.filter(item => selectDateCalendar === formattedSelectedDate);
        setFormData(filteredData)
    
        const carbsAll = filteredData.reduce((sum, data) => sum + data.carbs, 0)
        setTotalCarbs(carbsAll)
    
        const proteinAll = filteredData.reduce((sum, data) => sum + data.protein, 0)
        setTotalProtein(proteinAll)
    
        const fatAll = filteredData.reduce((sum, data) => sum + data.fat, 0)
        setTotalFat(fatAll)
    
        const kcalAll = filteredData.reduce((sum, data) => sum + data.calories, 0)
        setTotalKcal(kcalAll)
  
      })  
    })
    .catch(error => console.log(error))
  },[token, m_calendar_id,member_num,selectedDate])

  const getDietByType = (type) => {
    return formData.filter(data => data.diet_type === type)
  }

  //날짜변경 핸들러. 선택한 날짜 업데이트되고, url 쿼리 파라미터도 같이 변경됨
  const handleDateChange = (date)=>{
     setSelectedDate(date)
     const formattedDate = date.toISOString().split("T")[0]
     queryParams.set("date",formattedDate)
     navigate(`?date=${formattedDate}`, { replace: true })
  }

  //전체삭제
  const handleAllDelete=()=>{
    axios.delete(`/dietjournal/all/${m_calendar_id}`)
    .then(res=>{
      if(res.data.isSuccess){
        alert("삭제 완료되었습니다.")
        navigate('/member/calendar')
      }else{
        alert("식단 삭제 실패")
      }
    })
    .catch(error=>
      console.log(error),
      alert("일정삭제 에러")
    )
  }  

//식단삭제
  const handleDelete=()=>{
    axios.delete(`/dietjournal/${d_journal_id}`)
    .then(res => {
      if(res.data.isSuccess){
        setFormData(data => data.filter(item => item.d_journal_id !== d_journal_id))
        alert("식단 삭제 완료되었습니다.")
      }else{
        alert("식단 삭제 실패")
      }
    })
    .catch(error=>console.log(error))
  }

  //수정버튼 클릭시 이동
  const handleReserve = () =>{
    navigate(`/member/dietadd/${m_calendar_id}/${d_journal_id}&date=${selectedDate.toISOString().split('T')[0]}`)
  }

  return (
    <>
    <div>
      <Row>
        <Col>
          <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0">
              <h1>{selectedDate.toLocaleDateString('ko-KR')}의 식단</h1>
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
      </Row>
      <Row>
        <Col xs={24} md={12}>
            <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0">
            <div className="d-flex justify-content-end mb-3">
              {/*이거 navigate 나중에 옮길땐 따로 바꿔야함*/}
              <Button onClick={handleReserve} variant="secondary" className="me-2">reserve</Button>
              <Button onClick={handleAllDelete} variant="secondary">Delete</Button>
            </div>
            </Card.Header>
            <Card.Body className="">
            <div>
              <Row className="align-items-center">
                <Col  xs={1}>
                <span>탄수화물</span>
                </Col>
                <Col>
                <ProgressBar striped variant="success" animated now={40} style={{height:'30px'}} />
                </Col>
                <Col xs="auto">
                <span>{totalCarbs}</span>
                </Col>
              </Row>
                <br/>
                <Row className="align-items-center">
                <Col  xs={1}>
                  <span>단백질</span>
                </Col>
                <Col>
                <ProgressBar striped variant="info" animated now={20} style={{height:'30px'}}/>
                </Col>
                <Col xs="auto">
                <span>{totalProtein}</span>
                </Col>
              </Row>
                <br/>
                <Row className="align-items-center">
                <Col xs={1}>
                  <span>지방</span>
                </Col>
                <Col>
                <ProgressBar striped variant="warning" animated now={60} style={{height:'30px'}}/>
                </Col>
                <Col xs="auto">
                  <span>{totalFat}</span>
                </Col>
              </Row>
                <br/>
                <Row className="align-items-center">
                <Col xs={1}>
                  <span>칼로리</span>
                </Col>
                <Col>
                <ProgressBar striped variant="danger" animated now={80} style={{height:'30px'}}/>
                </Col>
                <Col xs="auto">
                  <span>{totalKcal}</span>
                </Col>
              </Row>
            </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
     </div>
     <div >
      <Row className="g-3">
      {["아침", "점심", "저녁"].map((mealType) => (
            <Col xs={12} md={4} key={mealType}>
              <Card>
                <Card.Header as="h6" className="border-bottom p-3 mb-0 d-flex justify-content-between align-items-center">
                  {mealType}
                  <Button onClick={() => handleDelete()} variant="secondary">삭제</Button>
                </Card.Header>
                <Card.Body>
                  <ul>
                    {getDietByType(mealType).map((data) => (
                      <li key={data.d_journal_id}>
                        {data.food}: {data.foodCount}g 
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </div>
     </>
  )
}

export default MemberDietJournal