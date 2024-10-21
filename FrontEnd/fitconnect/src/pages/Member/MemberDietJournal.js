import axios from "axios"
import React, { useEffect, useState } from "react"
import { Button, Card, Row, Col } from "react-bootstrap"
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MemberDietJournal(){

  const [m_calendar_id, setMCalendarId] = useState(0);
  const [formData,setFormData] = useState([])
  const [totalCarbs, setTotalCarbs] = useState(0)
  const [totalProtein, setTotalProtein] = useState(0)
  const [totalFat, setTotalFat] = useState(0)
  const [totalKcal, setTotalKcal] = useState(0)
  const [mergedData, setMergedData] = useState([]); 
  const token = localStorage.getItem('token')
  
  const navigate = useNavigate()
  const location = useLocation()
  const { regdate }= location.state || {};
  const [formattedDate, setFormattedDate] = useState();

  // 오늘 날짜
  const today = new Date()
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // location 넘어올 경우 날짜
  const initialDateStr = regdate ? regdate : localDate;
  const initialDate = new Date(initialDateStr)
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const [breakfastData, setBreakfastData] = useState([]);
  const [lunchData, setLunchData] = useState([]);
  const [dinnerData, setDinnerData] = useState([]);

  useEffect(() => {
    //selectedDate에서 년월일 추출하는 식
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // 월을 두 자리 숫자로 만들기
    const day = ("0" + date.getDate()).slice(-2);
    setFormattedDate(`${year}-${month}-${day}`);
  }, [selectedDate])


  useEffect(()=>{
    if(formattedDate){ // formatteedDate 가 설정된 후에만 실행
      setMergedData([])
      axios.get(`/dietjournal/date/${formattedDate}`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      .then(res=>{
        const newMCalendarId = res.data.list[0]?.m_calendar_id; // 옵셔널 체이닝으로 안전하게 접근
        setMCalendarId(newMCalendarId);
        setMergedData(res.data.list || []) 

      })
      .catch(error => {
        console.error(`Diet Journal API 요청 실패:`, error);
      });
    }
  }, [formattedDate]);

  
  useEffect(() => {
    if (mergedData != null) {
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

    }
  }, [mergedData]);

  const handleDateChange = (date)=>{
     setSelectedDate(date)
     const formattedDate = date.toISOString().split("T")[0]
     navigate(`/member/dietjournal`, {
      state: {
        regdate: formattedDate
      }})
  }

  const handleAllDelete=()=>{
    
    axios.delete(`/dietjournal/all/${m_calendar_id}`)
    .then(res=>{
      if(res.data.isSuccess){
        alert("삭제 완료되었습니다.")
        navigate(0)
    }
    })
    .catch(error=>{
      console.log(error)
      alert("일정삭제 에러")
    })
  }  

  const handleReserve = () =>{
    navigate(`/member/dietadd`, {
      state: {
        regdate: formattedDate
      }
  })
}
  
  const graphCarbs = (totalCarbs/500) * 100 // 한국 성인 남성 탄수화물 섭취량 약 304g
  const graphProtein = (totalProtein/120) * 100 // 성인 기준 체중 kg 당 0.73g 단백질 섭취
  const graphFat = (totalFat/100) * 100 // 한국인 평균 지방 섭취량 53.9g 
  const graphKcal = (totalKcal / 4000) * 100 // 한국인 성인 남성 평균 2500kcal~3600kcal 섭취

  // 메인페이지에서 아침,점심,저녁 카드가 아래로 쌓이게 할 설정
  const width = location.pathname === "/member" ? 12 : 4
  //메인페이지에서 reserve / Delete 버튼을 보이지않게 하기 위한 설정
  const styleNone = location.pathname === "/member" ? {display:"none"} : {display:"flex"}
  const styleNone2 = location.pathname === "/member/dietjournal" ? {display:"none"} : {display:"flex"}

  return (
    <div style={{fontFamily:'nanumsquare', fontWeight:700}}>
    <div>
      <Row>
        <Col>
          <Card>
            <Card.Header  className="Header">
              <h3 style={{marginBottom:15}}>{selectedDate.toLocaleDateString('ko-KR')}의 식단</h3>
              { mergedData.length === 0 && (
                  <p>해당 일자의 식단 일지를 등록해 주세요

                  </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="yyyy년 MM월 dd일"
                      placeholderText="날짜를 선택하세요"
                  />
                  <Button variant="dark" onClick={handleReserve} style={styleNone2}>
                      등록
                  </Button>
              </div>

            </Card.Header>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
            <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0" style={styleNone}>
            <div className="d-flex justify-content-end mb-3" >
              <Button onClick={handleReserve}  className="me-2">등록하기</Button>
              <Button onClick={handleAllDelete} variant="danger">삭제하기</Button>
            </div>
            </Card.Header>
            <Card.Body className="">
            <div>
              <Row className="align-items-center">
                <Col xs={4}>
                <span>탄수화물</span><br/>
                <span style={{fontSize: "10px", color: "grey"}}>기준: 500g</span>
                </Col>
                <Col>
                <ProgressBar striped variant="success" animated now={graphCarbs} style={{height:'30px'}} />
                </Col>
                <Col xs="auto">
                <span>{graphCarbs.toFixed(1)}%</span>
                </Col>
              </Row>
                <br/>
                <Row className="align-items-center">
                <Col xs={4}>
                  <span>단백질</span><br/>
                  <span style={{fontSize: "10px", color: "grey"}}>기준: 120g</span>
                </Col>
                <Col>
                <ProgressBar striped variant="info" animated now={graphProtein} style={{height:'30px'}}/>
                </Col>
                <Col xs="auto">
                <span>{graphProtein.toFixed(1)}%</span>
                </Col>
              </Row>
                <br/>
                <Row className="align-items-center">
                <Col xs={4}>
                  <span>지방</span><br/>
                  <span style={{fontSize: "10px", color: "grey"}}>기준: 100g</span>
                </Col>
                <Col>
                <ProgressBar striped variant="warning" animated now={graphFat} style={{height:'30px'}}/>
                </Col>
                <Col xs="auto">
                  <span>{graphFat.toFixed(1)}%</span>
                </Col>
              </Row>
                <br/>
                <Row className="align-items-center">
                <Col xs={4}>
                  <span>칼로리</span><br/>
                  <span style={{fontSize: "10px", color: "grey"}}>기준: 4000g</span>
                </Col>
                <Col>
                <ProgressBar striped variant="danger" animated now={graphKcal} style={{height:'30px'}}/>
                </Col>
                <Col xs="auto">
                  <span>{graphKcal.toFixed(1)}%</span>
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
            <Col xs={12} sm={12} md={width}>
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
      
            <Col xs={12} sm={12} md={width}>
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
    
            <Col  xs={12} sm={12} md={width}>
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
     </div>
  )
}

export default MemberDietJournal