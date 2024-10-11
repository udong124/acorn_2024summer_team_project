import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button, Card, Row, Col, InputGroup, DropdownButton, Dropdown, Form, Table } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Checkbox, Radio } from "antd";
import DietListAddModal from "../../components/DietListAddModal";

function MemberDietJournalAdd() {
    // const [m_calendar_id, setMCalendarId] = useState(null);
    const [d_journal_id, setDJournalId] = useState(null);

    const [dietType, setDietType] = useState("");
    const [search, setSearch] = useState("");
    const [dietList, setDietList] = useState([]);
    const [select, setSelect] = useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [formData, setFormData] = useState({});

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const initialDateStr = queryParams.get("date") ? queryParams.get("date") : localDate;
    const initialDate = new Date(initialDateStr);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const token = localStorage.getItem('token');
    //음식 추가 모달 창을 띄우기 위해
    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
   

    useEffect(() => {
        if (!queryParams.get("date")) {
            const formattedDate = selectedDate.toISOString().split("T")[0];
            navigate(`?date=${formattedDate}`, { replace: true });
        }
    }, [selectedDate, navigate, queryParams]);

    useEffect(() => {


        axios.get('/dietlist')
            .then(res => {
                console.log("전체 식단 리스트", res.data.list);
                if (Array.isArray(res.data.list)) {
                    setDietList(res.data.list);
                } else {
                    setDietList([]);
                    console.error('API에서 값을 받아오지 못했습니다', res.data);
                }
            })
            .catch(error => console.log(error));


    }, [token, selectedDate]);

    const handleChange = (e) => {
        setSearch(e.target.value);
    };



    const handleClickAdd = () => {
        if (dietType === "" ) {
            alert("식단 유형을 선택해주세요.");
            return;
        }

        if (selectedRowIndex === null) {
            alert("추가할 식단을 선택해주세요.");
            return;
        }

        const selectedDiet = dietListSearch[selectedRowIndex];

        if (select.some(diet => diet.diet_id === selectedDiet.diet_id)) {
            alert("이미 추가된 식단입니다.");
            return;
        }

        const updatedDiet = {
            ...selectedDiet,
            diet_type: dietType,
            ...formData[selectedRowIndex]
        };

        setSelect([...select, updatedDiet]);
        setSelectedRowIndex(null);
        setFormData({ foodCount: '' });
    };

    const dietListSearch = dietList.filter(data =>
        (data.food || "").toLowerCase().includes((search || "").toLowerCase())
    );



    const handleWeightChange = (index, foodcount) => {
        if (isNaN(foodcount) || foodcount <= 0) {
            console.error('유효하지 않은 무게 값');
            return;
        }
        const updatedFormData = { ...formData };
        updatedFormData[index] = {
            ...updatedFormData[index],
            foodcount,
            calories: Math.round((dietListSearch[index]?.calories * foodcount) / 100),
            carbs: Math.round((dietListSearch[index]?.carbs * foodcount) / 100),
            protein: Math.round((dietListSearch[index]?.protein * foodcount) / 100),
            fat: Math.round((dietListSearch[index]?.fat * foodcount) / 100),
        };
        setFormData(updatedFormData);
    };

    const handleSubmit = (()=>{
        const formattedDate = selectedDate.toISOString().split("T")[0];
        const addDiet = select.map(item=>
            {
                return{
                diet_id:item.diet_id,
                diet_type:item.diet_type,
                foodCount:item.foodcount
            }})
            console.log(addDiet)
        axios.post(`/dietjournal/date/${formattedDate}`, addDiet)
            .then((res) => {
              if (res) {
                
                console.log("운동 추가 및 수정 완료");
              } else {
                console.error("응답 실패:", res.data);
                alert("저장에 실패했습니다.");
              }
            })
            .catch((error) => {})
        
    })

   

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = date.toISOString().split("T")[0];
        navigate(`/member/dietadd?date=${formattedDate}`, { replace: true });
        window.location.reload();
    };

    return (
        <div>
            <Row>
                <Col>
                    <Card>
                        <Card.Header as="h6" className="border-bottom p-3 mb-0">
                            <h2>{selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}의 식단 추가</h2>
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
                <Col xs={12} md={6}>
                    <Card>
                        <Card.Header as="h6" className="border-bottom p-3 mb-0">식단선택</Card.Header>
                            <Card.Body>
                                <Form>
                                    <div className="d-flex" >
                                        <Form.Check onChange={() => setDietType('아침')} type="radio" label="아침" name="meal"/>
                                        <Form.Check onChange={() => setDietType('점심')} type="radio" label="점심" name="meal"/>
                                        <Form.Check onChange={() => setDietType('저녁')} type="radio" label="저녁" name="meal"/>                                    
                                    </div>
                                </Form>
                            <InputGroup className="mb-3">
                                <Form.Control onChange={handleChange} placeholder="식단검색" type="text" />
                            </InputGroup>
                            

                            <Button className="mb-3" onClick={handleClickAdd}>식단 추가</Button>
                            <Button className="mb-3"  onClick={()=>{setShowModal(true)}}>식단 추가</Button>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>음식</th>
                                        <th>칼로리</th>
                                        <th>탄수화물</th>
                                        <th>단백질</th>
                                        <th>지방</th>
                                        <th>무게 (g)</th>
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
                                                    min="10" // 최소값 설정
                                                    step="10" // 10 단위로 증가하도록 설정
                                                    placeholder="100g"
                                                    value={formData[index]?.foodcount || ''}
                                                    onChange={(e) => handleWeightChange(index, Number(e.target.value))}
                                                    className="w-100"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        <Card.Header as="h6" className="border-bottom p-3 mb-0">
                            추가한 식단목록
                        </Card.Header>
                        <Card.Body>
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
                                        <th>무게 (g)</th>
                                        <th>삭제</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {select.map((data, index) => (
                                        <tr key={data.diet_id || index}>
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
                                                    const updatedSelect = select.filter((_, idx) => idx !== index);
                                                    setSelect(updatedSelect);
                                                }} variant="outline-danger">삭제</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                        <Button onClick={handleSubmit} variant="primary">완료</Button>
                    </Card>
                    <DietListAddModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                    />
                </Col>
            </Row>

        </div>
    );

}

export default MemberDietJournalAdd;