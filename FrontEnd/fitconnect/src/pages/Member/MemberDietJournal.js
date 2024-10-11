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
  const { regdate }= location.state || {};

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
  
  useEffect(()=>{
    //selectedDate에서 년월일 추출하는 식
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // 월을 두 자리 숫자로 만들기
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = `${year}-${month}-${day}`;

    console.log("날짜: " + formattedDate)

    axios.get(`/dietjournal/date/${formattedDate}`)
    .then(res=>{
      mergedData = mergedData.concat(res.data.list || []);
      setMergedData(mergedData);
    })
    .catch(error => {
      console.error(`Diet Journal API 요청 실패:`, error);
    });

    // axios.get('/membercalendar')
    // .then(res=>{
    //   console.log("총괄", res)
    //   console.log("오늘 날짜 (formattedSelectedDate):", formattedSelectedDate);
    //   const filteredData = res.data.filter(item => {
    //     return item.regdate.split(" ")[0] === formattedSelectedDate && item.memo === "식단";
    //   });
    //   console.log("필터링된 데이터 (오늘 날짜와 일치하는 항목):", filteredData);

    //   const mCalendarIds = filteredData.map(item => item.m_calendar_id);
    //   console.log("m_calendar_id 배열:", mCalendarIds);

    //   let mergedData = [];
    //   let counter = 0; 
    //   mCalendarIds.forEach((m_calendar_id, index) => {
    //     axios.get(`/dietjournal/${m_calendar_id}`)
    //       .then(res=>{
    //         mergedData = mergedData.concat(res.data.list || []);
    //         counter++;
    //         if (counter === mCalendarIds.length) {
    //           console.log("모든 요청 완료, 병합된 데이터:", mergedData);
    //           setMergedData(mergedData);
    //         }
    //       })
    //       .catch(error => {
    //         console.error(`Diet Journal API 요청 실패 (m_calendar_id: ${m_calendar_id}):`, error);
    //       });
    //   })
      
    //   console.log(`캘린더아이디 확인 : ${m_calendar_id}`)
    //   console.log(`멤버아이디 확인 : ${member_num}`)
    // }).catch(error=> console.log(error))
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
     regdate.set("date",formattedDate)
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
  
  const graphCarbs = (totalCarbs/500) * 100 // 한국 성인 남성 탄수화물 섭취량 약 304g
  const graphProtein = (totalProtein/120) * 100 // 성인 기준 체중 kg 당 0.73g 단백질 섭취
  const graphFat = (totalFat/100) * 100 // 한국인 평균 지방 섭취량 53.9g 
  const graphKcal = (totalKcal / 4000) * 100 // 한국인 성인 남성 평균 2500kcal~3600kcal 섭취

  console.log(location)
  // 메인페이지에서 아침,점심,저녁 카드가 아래로 쌓이게 할 설정
  const width = location.pathname === "/member" ? 12 : 4
  //메인페이지에서 reserve / Delete 버튼을 보이지않게 하기 위한 설정
  const styleNone = location.pathname === "/member" ? {display:"none"} : {display:"flex"}
  return (
    <>
    <div>
      <Row>
        <Col>
          <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0">
              <p style={{fontSize: "1.5em", fontWeight: "bold"}}>{selectedDate.toLocaleDateString('ko-KR')}의 식단</p>
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
      </Row>
      <Row>
        <Col md={12}>
            <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0" style={styleNone}>
            <div className="d-flex justify-content-end mb-3">
              <Button onClick={handleReserve} variant="secondary" className="me-2">reserve</Button>
              <Button onClick={handleAllDelete} variant="secondary">Delete</Button>
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
     </>
  )
}

export default MemberDietJournal