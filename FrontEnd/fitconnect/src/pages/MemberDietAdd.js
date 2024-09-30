//식단 추가및 수정
import axios from "axios"
import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router'
import { Modal, Button, Card, Row, Col, InputGroup, DropdownButton, Dropdown, Form, ListGroup, ListGroupItem, Table } from "react-bootstrap"


function MemberDietJournal(){
    const {m_calendar_id} = useParams()
    const {d_journal_id} = useParams()

    const [dietType, setDietType] = useState('선택')//아점저
    const [search, setSearch] = useState("")//검색
    const [dietList, setDietList] = useState([])//총식단리스트 오리지널 데이터
    const [select, setSelect] = useState([])//식단선택에서 고른거
    const [date,setDate] = useState()//n이전페이지에서 날짜담을
    const [isModalOpen,setIsModalOpen]=useState(false)//음식추가모달창여부
    const [foodData,setFoodData]=useState([])//음식데이터 추가할때
    const [selectedRowIndex, setSelectedRowIndex] = useState(null) // 선택된 테이블 행 인덱스


    const [formData,setFormData]=useState({}) //임시데이터값 받아와서 무게에따라 바뀌게하기위해
    
    const navigate = useNavigate()//이건 나중에 이동할거

    const token = localStorage.getItem('token')

    useEffect(()=>{ 
        const date = localStorage.getItem('selectDate') 
        setDate(date)
        /*날짜 화면에 띄어보려하는데 에러나는것입니다.*/


        //오리지널 식단리스트 가져오는거
        axios.get('/dietlist')
        .then(res => {
            // res.data가 배열인지 확인후 배열이 아니면 빈 배열설정
            if (Array.isArray(res.data)) {
              setDietList(res.data)
              setFormData(res.data.map(item => ({ ...item, foodcount: 100 })))
            } else {
              setDietList([]) // 배열이 아니다 그럼 빈 배열설정
              console.error('API에서 받은 데이터가 배열이 아닙니다:', res.data)
            }
          })
        .catch(error => console.log(error))
    },[token])
    
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
        const newDietList = isFoodData.map((food, idx) => ({
            diet_id: dietList.length + idx + 1, 
            ...food
        }))
        setDietList([...dietList, ...newDietList])
        handleCloseModal()
    })
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

    const handleSubmit= async() => {
        if (select.length === 0) {
            alert("추가된 식단이 없습니다.")
            return
        }
        try {
            const getData = await axios.get(`/dietjournal/${m_calendar_id}`)
    
            if (getData.data) {
                //안에 암것도 없을때 등록시
                await axios.put(`/dietjournal/${m_calendar_id}`, {
                    m_calendar_id, 
                    diet: select.map(data => ({
                        diet_id: data.diet_id,
                        diet_type: data.diet_type,
                        foodCount: data.foodcount
                    })) 
                })
            }
        } catch (error) {console.log(error)}

        //이건 수정할때
        axios.post(`/dietjournal/${d_journal_id}`,{
            m_calendar_id, 
            diet: select.map(data => ({
                diet_id: data.diet_id, 
                diet_type: data.diet_type, 
                foodCount: data.foodcount 
            }))
        })
    }


  return (
    <div>
        <h1>{setDate}</h1>
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
                
                <Modal show={isModalOpen} onHide={handleOpenModal}>
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
                                            <Form.Control 
                                                placeholder="음식" 
                                                value={food.food} 
                                                onChange={(e) => {
                                                    const updatedFood = [...foodData]
                                                    updatedFood[index].food = e.target.value
                                                    setFoodData(updatedFood)
                                                }} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control 
                                                type="number" 
                                                placeholder="kcal" 
                                                value={food.calories} 
                                                onChange={(e) => {
                                                    const updatedFood = [...foodData]
                                                    updatedFood[index].calories = Number(e.target.value)
                                                    setFoodData(updatedFood)
                                                }} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control 
                                                type="number" 
                                                placeholder="g" 
                                                value={food.carbs} 
                                                onChange={(e) => {
                                                    const updatedFood = [...foodData]
                                                    updatedFood[index].carbs = Number(e.target.value)
                                                    setFoodData(updatedFood)
                                                }} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control 
                                                type="number" 
                                                placeholder="g" 
                                                value={food.protein} 
                                                onChange={(e) => {
                                                    const updatedFood = [...foodData]
                                                    updatedFood[index].protein = Number(e.target.value)
                                                    setFoodData(updatedFood)
                                                }} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control 
                                                type="number" 
                                                placeholder="g" 
                                                value={food.fat} 
                                                onChange={(e) => {
                                                    const updatedFood = [...foodData]
                                                    updatedFood[index].fat = Number(e.target.value)
                                                    setFoodData(updatedFood)
                                                }} 
                                            />
                                        </td>
                                        <td>
                                            <Form.Control 
                                                type="number" 
                                                placeholder="g" 
                                                value={food.foodcount} 
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
            <Button onClick={()=>{handleSubmit();navigate('/') /*난제 이동경로 바꾸기*/}} >완료</Button> 
          </Card>
        </Col>
      </Row>
     </div>
  )
}

export default MemberDietJournal