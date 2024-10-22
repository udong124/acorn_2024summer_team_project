import axios from "axios"
import React, { useEffect, useState } from "react"
import { Button, Card, Row, Col, Modal } from "react-bootstrap"
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useLocation, useNavigate, useParams } from "react-router-dom"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modalcss from "./css/Modal.css"


function DietModal({ dietModal, setDietModal, member_num, name }){

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
    if(dietModal === false)return
    setMergedData([])
    axios.get(`/trainer/memberlist/dietjournal/${formattedDate}`, 
        {
      params : {member_num : member_num }
        }
    )
    .then(res=>{
      setMergedData(res.data.list || []) 
    })
    .catch(error => {
      console.error(`Diet Journal API 요청 실패:`, error);
    });

  }, [formattedDate, dietModal]);

  
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
        setSelectedDate(date); // 선택한 날짜 업데이트

        // 새로운 날짜 포맷으로 업데이트
        const updatedDate = new Date(date);
        const year = updatedDate.getFullYear();
        const month = ("0" + (updatedDate.getMonth() + 1)).slice(-2);
        const day = ("0" + updatedDate.getDate()).slice(-2);
        const newFormattedDate = `${year}-${month}-${day}`;

        setFormattedDate(newFormattedDate); // 새로운 형식화된 날짜 설정
  }


  
  const graphCarbs = (totalCarbs/500) * 100 // 한국 성인 남성 탄수화물 섭취량 약 304g
  const graphProtein = (totalProtein/120) * 100 // 성인 기준 체중 kg 당 0.73g 단백질 섭취
  const graphFat = (totalFat/100) * 100 // 한국인 평균 지방 섭취량 53.9g 
  const graphKcal = (totalKcal / 4000) * 100 // 한국인 성인 남성 평균 2500kcal~3600kcal 섭취

 

  return (
    <Modal show={dietModal} onHide={() => {
      setMergedData([]);
      setDietModal(false);
    }}>
        <Modal.Header as="h6" className="border-bottom p-3 mb-0"  closeButton>
            <p style={{fontSize: "1.5em", fontWeight: "bold", margin:"auto"}}>{selectedDate.toLocaleDateString('ko-KR')}의 식단</p>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy년 MM월 dd일"
                placeholderText="날짜를 선택하세요"
                style={{ width: "80%", boxSizing: "border-box" }} 
            />
        </Modal.Header>
        <Modal.Body style={{fontFamily:'nanumsquare', fontWeight:700}}>
          {mergedData.length === 0 ? (
            <div className="text-center">
                <p>등록된 일지가 없습니다.</p>
            </div>
          ) : (
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
        )}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            {mergedData.length === 0 ? (
              <div className="w-100 text-center">
                  <p>등록된 일지가 없습니다.</p>
              </div>
            ) : (
              <div>
                  <Row className="g-3">
                      <Col>
                      <Card className="mx-auto">
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
              
                      <Col xs={12} sm={12} md={12}>
                      <Card>
                          <Card.Header>
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
              
                      <Col  xs={12} sm={12} md={12}>
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
          )}
        </Modal.Footer>
    </Modal>

  )
}

export default DietModal