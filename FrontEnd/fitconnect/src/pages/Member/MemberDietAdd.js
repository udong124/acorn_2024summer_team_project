//식단 추가및 수정
import axios from "axios"
import React, { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal, Button, Card, Row, Col, InputGroup, DropdownButton, Dropdown, Form, ListGroup, ListGroupItem, Table } from "react-bootstrap"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MemberDietJournalAdd(){
    const {m_calendar_id, d_journal_id} = useParams()

    const [dietType, setDietType] = useState('선택')//아점저
    const [search, setSearch] = useState("")//검색
    const [dietList, setDietList] = useState([])//총식단리스트 오리지널 데이터
    const [select, setSelect] = useState([])//식단선택에서 고른거
    const [isModalOpen,setIsModalOpen]=useState(false)//음식추가모달창여부
    const [foodData,setFoodData]=useState([])//음식데이터 추가할때
    const [selectedRowIndex, setSelectedRowIndex] = useState(null) // 선택된 테이블 행 인덱스
    const [formData,setFormData]=useState({}) //임시데이터값 받아와서 무게에따라 바뀌게하기위해
    
    const navigate = useNavigate()//이건 나중에 이동할거
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    
    const initialDate = queryParams.get("date") ? new Date(queryParams.get("date")) : new Date();
    const [selectedDate, setSelectedDate] = useState(initialDate)

    const token = localStorage.getItem('token')

    useEffect(()=>{ 
        //오리지널 식단리스트 가져오는거
        axios.get('/dietlist')
        .then(res => {
            // res.data가 배열인지 확인후 배열이 아니면 빈 배열설정
            if (Array.isArray(res.data)) {
              setDietList(res.data)
              setFormData(res.data.map(item => ({ ...item, foodcount: 100 })))
            } else {
              setDietList([]) // 배열이 아니다 그럼 빈 배열설정
              console.error('API에서 값을 받아오지 못했습니다', res.data)
            }
          })
        .catch(error => console.log(error))

        if(select.length>0){
            axios.get(`/dietjournal/${m_calendar_id}`)
            .then(res=>{
                axios.get(`/membercalendar/${m_calendar_id}`)
                .then(calendarRes=>{
                    const selectDateCalendar = calendarRes.data.date
                    const filteredData = res.data.filter(item=>selectDateCalendar===selectedDate)
                    
                    const saveLoadData = filteredData.map(data => ({
                        diet_type: data.diet_type,
                        food: data.food,
                        calories: data.calories,
                        carbs: data.carbs,
                        protein: data.protein,
                        fat: data.fat,
                        foodcount: data.foodCount
                    }))
                    setSelect(saveLoadData)
                }).catch(error=>console.log(error))

            }).catch(error=>console.log(error))
        }
    },[token,m_calendar_id,select.length,selectedDate])
    
    const handleChange =(e)=>{
        setSearch(e.target.value)
    }

    const handleClickAdd = () => { //식단선택후 추가하는 테이블
        if (dietType === '선택') {
            alert("식단 유형을 선택해주세요.")
            return
        }
    
        if (selectedRowIndex === null) {
            alert("추가할 식단을 선택해주세요.")
            return
        }
    
        const selectedDiet = formData[selectedRowIndex]
    
        //같은 dietType에 같은음식 추가방지
        const isAlreadyAdded = select.some(diet => diet.diet_id === selectedDiet.diet_id && diet.diet_type === dietType)
        if (isAlreadyAdded) {
            alert("이미 추가된 식단입니다.")
            return
        }
    
        setSelect([...select, { ...selectedDiet, diet_type: dietType }])
        setSelectedRowIndex(null)
    }
    

    const dietListSearch = dietList.filter(data=>
        data.food.toLowerCase().includes(search.toLowerCase())
    )

    const handleFoodDataAdd =(e)=>{
    const isFoodData = foodData.filter(food => 
        food.food.trim() !== "" &&
        !isNaN(food.calories) &&
        !isNaN(food.carbs) &&
        !isNaN(food.protein) &&
        !isNaN(food.fat) &&
        !isNaN(food.foodcount) &&
        food.foodcount > 0
    )

    if(isFoodData.length === 0){
        alert("제대로된 식단데이터를 입력")
        return
    }

    axios.post('/dietlist', isFoodData)
    .then(res => {
        if(res.data.isSuccess){
        const newDietList = isFoodData.map((food, idx) => ({
            diet_id: dietList.length + idx + 1, 
            ...food
        }))
        setDietList([...dietList, ...newDietList])
        handleCloseModal()
        navigate(`/MemberDietJournal?date=${selectedDate.toISOString().split('T')[0]}&m_calendar_id=${m_calendar_id}`)
    }})
    .catch(error => {
        console.log(error)
        alert("식단 데이터 추가실패!")
    })
    }

    const handleWeightChange = (index, foodcount) => {
        if (isNaN(foodcount) || foodcount <= 0) {
            console.error('유효하지 않은 무게 값')
            return
        }
    
        const updatedFormData = [...formData]
        updatedFormData[index] = {
            ...updatedFormData[index],
            foodcount,
            calories: Math.round((dietList[index].calories * foodcount) / 100),
            carbs: Math.round((dietList[index].carbs * foodcount) / 100),
            protein: Math.round((dietList[index].protein * foodcount) / 100),
            fat: Math.round((dietList[index].fat * foodcount) / 100),
        }
        setFormData(updatedFormData)
    }
    
    const handleDateChange = (date)=>{
        setSelectedDate(date)
        const formattedDate = date.toISOString().split("T")[0]
        queryParams.set("date",formattedDate)
        navigate(`?date=${formattedDate}`)
    }

    const handleOpenModal=()=>{
        setIsModalOpen(true)
    }
    
    const handleCloseModal=()=>{
        setIsModalOpen(false)
    }

    const handleTableAdd=()=>{
        setFoodData([...foodData, { food: "", calories: "", carbs: "", protein: "", fat: "", foodcount: "" }])
    }

    const handleTableDelete=(index)=>{
        setFoodData(foodData.filter((_, idx) => idx !== index))
    }

    const fetchUpdatedDietData = async()=>{
        try {
            const res = await axios.get(`/dietjournal/${m_calendar_id}`);
            if (res.data) {
              const calendarRes = await axios.get(`/membercalendar/${m_calendar_id}`)
              const selectDateCalendar = calendarRes.data.date;
              const filteredData = res.data.filter(item => selectDateCalendar === selectedDate);
        
              const saveLoadData = filteredData.map(data => ({
                diet_type: data.diet_type,
                food: data.food,
                calories: data.calories,
                carbs: data.carbs,
                protein: data.protein,
                fat: data.fat,
                foodcount: data.foodCount
              }));
              setSelect(saveLoadData);
            }
          } catch (error) {
            console.log(error);
          }
        }

    const handleSubmit= async() => {
        if (select.length === 0) {
            alert("추가된 식단이 없습니다.")
            return
        }
        try {
            let response;
        
            //수정
            if (d_journal_id) {
              response = await axios.put(`/dietjournal/${d_journal_id}`, {
                m_calendar_id,
                diet: select.map(data => ({
                  diet_id: data.diet_id,
                  diet_type: data.diet_type,
                  foodCount: data.foodcount,
                }))
              })
            } else {
              //새로추가
              response = await axios.post(`/dietjournal/${m_calendar_id}`, {
                m_calendar_id,
                diet: select.map(data => ({
                  diet_id: data.diet_id,
                  diet_type: data.diet_type,
                  foodCount: data.foodcount,
                }))
              })
            }
        
            if (response.data.isSuccess) {
              await fetchUpdatedDietData();
        
              navigate(`/MemberDietJournal?date=${selectedDate.toISOString().split("T")[0]}`);
            } else {
              alert("저장 실패");
            }
          } catch (error) {
            console.log("저장 중 오류 발생:", error);
          }
        }


  return (
    <div>
      <Row>
        <Col>
          <Card>
           <Card.Header as="h6" className="border-bottom p-3 mb-0">
                <h2>{selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}의 식단 추가</h2>
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
        <Col xs={12} md={6}>
            <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0">식단선택</Card.Header>
            <Card.Body className="">
            <InputGroup className="mb-3">
                
                <DropdownButton
                variant="outline-secondary"
                title={dietType}
                id="input-group-dropdown-1"
                >
                    <Dropdown.Item onClick={()=>setDietType('아침')}>아침</Dropdown.Item>
                    <Dropdown.Item onClick={()=>setDietType('점심')}>점심</Dropdown.Item>
                    <Dropdown.Item onClick={()=>setDietType('저녁')}>저녁</Dropdown.Item>
                </DropdownButton>
                <Form.Control onChange={handleChange} placeholder="식단검색" type="text"/>
            </InputGroup>
                <Table bordered>
                <thead>
                    <tr>
                        <th>음식</th>
                        <th>칼로리</th>
                        <th>탄수화물</th>
                        <th>단백질</th>
                        <th>지방</th>
                        <th>무게</th>
                    </tr>
                </thead>
                <tbody>
                {dietListSearch.map((data, index) => (
                <tr key={data.diet_id}
                    onClick={() => setSelectedRowIndex(index)}
                    className={selectedRowIndex === index ? 'table-active' : ''}
                    style={{ cursor: 'pointer' }}>
                    
                    <td>{data.food}</td>
                    <td>{formData[index]?.calories || data.calories}</td>
                    <td>{formData[index]?.carbs || data.carbs}</td>
                    <td>{formData[index]?.protein || data.protein}</td>
                    <td>{formData[index]?.fat || data.fat}</td>
                    <td>
                        <Form.Control 
                            type="number" 
                            min="1" 
                            placeholder="g" 
                            value={formData[index]?.foodcount || ''} 
                            onChange={(e) => handleWeightChange(index, Number(e.target.value))}
                            className="w-100"
                        />
                    </td>
                </tr>
                ))}
                </tbody>
                </Table>
                 
                <Button onClick={handleOpenModal} className="open-modal-button" variant="outline-secondary">음식 데이터추가</Button>            
                <Button onClick={handleClickAdd}>식단추가</Button>
                
                <Modal show={isModalOpen} onHide={handleCloseModal}>
                <div className="modal show" style={{ display: 'block', position: 'initial' }}>
                    <Modal.Dialog>
                        <Modal.Header>
                        <Modal.Title>식단데이터 추가</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <InputGroup className="mb-3">
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>음식</th>
                                        <th>칼로리</th>
                                        <th>탄수화물</th>
                                        <th>단백질</th>
                                        <th>지방</th>
                                        <th>무게</th>
                                        <th><Button onClick={handleTableAdd}>+</Button></th>
                                    </tr>
                                </thead>
                                <tbody>                    
                                {foodData.map((food, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Form.Control placeholder="음식" value={food.food} 
                                            onChange={(e) => {
                                                    const updatedFood = [...foodData]
                                                    updatedFood[index].food = e.target.value
                                                    setFoodData(updatedFood)
                                                }} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control type="number" placeholder="kcal" value={food.calories} 
                                                onChange={(e) => {
                                                    const updatedFood = [...foodData]
                                                    updatedFood[index].calories = Number(e.target.value)
                                                    setFoodData(updatedFood)
                                                }} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control type="number" placeholder="g" value={food.carbs} 
                                                onChange={(e) => {
                                                    const updatedFood = [...foodData]
                                                    updatedFood[index].carbs = Number(e.target.value)
                                                    setFoodData(updatedFood)
                                                }} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control type="number"  placeholder="g" value={food.protein} 
                                                onChange={(e) => {
                                                    const updatedFood = [...foodData]
                                                    updatedFood[index].protein = Number(e.target.value)
                                                    setFoodData(updatedFood)
                                                }} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control type="number" placeholder="g" value={food.fat} 
                                                onChange={(e) => {
                                                    const updatedFood = [...foodData]
                                                    updatedFood[index].fat = Number(e.target.value)
                                                    setFoodData(updatedFood)
                                                }} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control type="number" placeholder="g" value={food.foodcount} 
                                                onChange={(e) => {
                                                    const updatedFood = [...foodData]
                                                    updatedFood[index].foodcount = Number(e.target.value)
                                                    setFoodData(updatedFood)
                                                }} 
                                            />
                                        </td>
                                        <td>
                                            <Button onClick={() => handleTableDelete(index)} variant="outline-danger">-</Button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                                </Table>
                            </InputGroup>
                        </Modal.Body>

                        <Modal.Footer>
                        <Button onClick={handleCloseModal} className="close-modal-button" variant="secondary">Close</Button>
                        <Button onClick={()=>{handleFoodDataAdd();handleCloseModal()}} className="close-modal-button" variant="primary">추가하기</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div>
                </Modal>                    
            </Card.Body>
          </Card>

        </Col>
        <Col xs={12} md={6}>
            <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0">
              추가한 식단목록
            </Card.Header>
            <Card.Body className="">
                <Table bordered>
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>언제</th>
                        <th>음식</th>
                        <th>칼로리</th>
                        <th>탄수화물</th>
                        <th>단백질</th>
                        <th>지방</th>
                        <th>무게</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                {select.map((data, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data.diet_type}</td>
                        <td>{data.food}</td>
                        <td>{data.calories}</td>
                        <td>{data.carbs}</td>
                        <td>{data.protein}</td>
                        <td>{data.fat}</td>
                        <td>{data.foodcount}</td>
                        <td>
                            <Button onClick={() => {
                                const updatedSelect = select.filter((_, idx) => idx !== index)
                                setSelect(updatedSelect)
                            }} variant="outline-danger">삭제</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
                </Table>
            </Card.Body>
            <Button onClick={handleSubmit} >완료</Button> 
          </Card>
        </Col>
      </Row>
     </div>
  )
}

export default MemberDietJournalAdd