import axios from "axios"
import React, { useEffect, useState } from "react"
import { Button, Card, Row, Col } from "react-bootstrap"
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MemberDietJournal(){
  const [member_num, setMemberNum] = useState(null)
  const [m_calendar_id, setMCalendarId] = useState(null)
  const [d_journal_id, setDJournalId] = useState(null)

  const [formData,setFormData] = useState([])
  const [totalCarbs, setTotalCarbs] = useState(0)
  const [totalProtein, setTotalProtein] = useState(0)
  const [totalFat, setTotalFat] = useState(0)
  const [totalKcal, setTotalKcal] = useState(0)
  const [mergedData, setMergedData] = useState([]); 
  const token = localStorage.getItem('token')
  
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const today = new Date()
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const initialDateStr = queryParams.get("date") ? queryParams.get("date") : localDate
  const initialDate = new Date(initialDateStr)
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const [breakfastData, setBreakfastData] = useState([]);
  const [lunchData, setLunchData] = useState([]);
  const [dinnerData, setDinnerData] = useState([]);
  
  useEffect(()=>{
    axios.get('/membercalendar')
    .then(res=>{
      console.log("총괄", res)
      const formattedSelectedDate = selectedDate.toISOString().split("T")[0];
      console.log("오늘 날짜 (formattedSelectedDate):", formattedSelectedDate);
      const filteredData = res.data.filter(item => {
        return item.regdate.split(" ")[0] === formattedSelectedDate && item.memo === "식단";
      });
      console.log("필터링된 데이터 (오늘 날짜와 일치하는 항목):", filteredData);

      const mCalendarIds = filteredData.map(item => item.m_calendar_id);
      console.log("m_calendar_id 배열:", mCalendarIds);

      let mergedData = [];
      let counter = 0; 
      mCalendarIds.forEach((m_calendar_id, index) => {
        axios.get(`/dietjournal/${m_calendar_id}`)
          .then(res=>{
            mergedData = mergedData.concat(res.data.list || []);
            counter++;
            if (counter === mCalendarIds.length) {
              console.log("모든 요청 완료, 병합된 데이터:", mergedData);
              setMergedData(mergedData);
            }
          })
          .catch(error => {
            console.error(`Diet Journal API 요청 실패 (m_calendar_id: ${m_calendar_id}):`, error);
          });
      })
      
      console.log(`캘린더아이디 확인 : ${m_calendar_id}`)
      console.log(`멤버아이디 확인 : ${member_num}`)
    }).catch(error=> console.log(error))
  }, [selectedDate]);

  const getDietByType = (type) => {
    return formData.filter(data => data.diet_type === type)
  }
  
  useEffect(() => {
    if (mergedData.length > 0) {
      const morningItems = mergedData.filter(item => item.diet_type === "아침");
      const lunchItems = mergedData.filter(item => item.diet_type === "점심");
      const dinnerItems = mergedData.filter(item => item.diet_type === "저녁");

      const carbsAll = morningItems.reduce((sum, data) => sum + data.carbs, 0)
                    + lunchItems.reduce((sum, data) => sum + data.carbs, 0)
      setTotalCarbs(carbsAll)
      const proteinAll = morningItems.reduce((sum, data) => sum + data.protein, 0)
      + lunchItems.reduce((sum, data) => sum + data.protein, 0)
      setTotalProtein(proteinAll)
  
      const fatAll = morningItems.reduce((sum, data) => sum + data.fat, 0)
        + lunchItems.reduce((sum, data) => sum + data.fat, 0)
        + dinnerItems.reduce((sum, data) => sum + data.fat, 0)
      setTotalFat(fatAll)
  
      const kcalAll = morningItems.reduce((sum, data) => sum + data.calories, 0)
        + lunchItems.reduce((sum, data) => sum + data.calories, 0)
        + dinnerItems.reduce((sum, data) => sum + data.calories, 0) 
      setTotalKcal(kcalAll)

      setBreakfastData(morningItems);
      setLunchData(lunchItems);
      setDinnerData(dinnerItems);

      console.log("아침 항목의 개수:", morningItems.length);
      console.log("점심 항목의 개수:", lunchItems.length);
      console.log("저녁 항목의 개수:", dinnerItems.length);
    }
  }, [mergedData]);

  const handleDateChange = (date)=>{
     setSelectedDate(date)
     const formattedDate = date.toISOString().split("T")[0]
     queryParams.set("date",formattedDate)
     navigate(`?date=${formattedDate}`, { replace: true })
  }

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
    .catch(error=>{
      console.log(error)
      alert("일정삭제 에러")
    })
  }  

  const handleReserve = () =>{
    console.log(selectedDate)
    const formattedDate2 = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    console.log(formattedDate2);
    navigate(`/member/dietadd/?date=${formattedDate2}`)
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
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="yyyy년 MM월 dd일"
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
              <Button onClick={handleReserve} variant="secondary" className="me-2">reserve</Button>
              <Button onClick={handleAllDelete} variant="secondary">Delete</Button>
            </div>
            </Card.Header>
            <Card.Body className="">
            <div>
              <Row className="align-items-center">
                <Col xs={1}>
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
                <Col xs={1}>
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
     <div>
      <Row className="g-3">
            <Col xs={12} md={4}>
              <Card>
                <Card.Header as="h6" className="border-bottom p-3 mb-0 d-flex justify-content-between align-items-center">
                  아침
                </Card.Header>
                <Card.Body>
                <ul>
              {breakfastData.map((item, index) => (
                <li key={index}>
                  {item.food} -  {item.foodCount} g- {item.calories} kcal
                </li>
              ))}
            </ul>
                </Card.Body>
              </Card>
            </Col>
      
            <Col xs={12} md={4}>
              <Card>
                <Card.Header as="h6" className="border-bottom p-3 mb-0 d-flex justify-content-between align-items-center">
                  점심
                </Card.Header>
                <Card.Body>
                <ul>
              {lunchData.map((item, index) => (
                <li key={index}>
                  {item.food} -  {item.foodCount} g- {item.calories} kcal
                </li>
              ))}
            </ul>
                </Card.Body>
              </Card>
            </Col>
    
            <Col xs={12} md={4}>
              <Card>
                <Card.Header as="h6" className="border-bottom p-3 mb-0 d-flex justify-content-between align-items-center">
                  저녁
                </Card.Header>
                <Card.Body>
                <ul>
              {dinnerData.map((item, index) => (
                <li key={index}>
                  {item.food} -  {item.foodCount} g- {item.calories} kcal
                </li>
              ))}
            </ul>
                </Card.Body>
              </Card>
            </Col>
      </Row>
    </div>
     </>
  )
}

export default MemberDietJournal
