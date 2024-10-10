import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button, Card, Row, Col, InputGroup, DropdownButton, Dropdown, Form, Table } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MemberDietJournalAdd() {
    // const [m_calendar_id, setMCalendarId] = useState(null);
    const [d_journal_id, setDJournalId] = useState(null);

    const [dietType, setDietType] = useState('선택');
    const [search, setSearch] = useState("");
    const [dietList, setDietList] = useState([]);
    const [select, setSelect] = useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [formData, setFormData] = useState({});
    const [newFood, setNewFood] = useState({
        food: "",
        calories: "",
        carbs: "",
        protein: "",
        fat: ""
    });
    const [m_calendar_id_max, setMCalendarIdMax] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const initialDateStr = queryParams.get("date") ? queryParams.get("date") : localDate;
    const initialDate = new Date(initialDateStr);
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!queryParams.get("date")) {
            const formattedDate = selectedDate.toISOString().split("T")[0];
            navigate(`?date=${formattedDate}`, { replace: true });
        }
    }, [selectedDate, navigate, queryParams]);

    useEffect(() => {
        // axios.get('/membercalendar')
        //     .then(res => {
        //         console.log(res.data);
        //         const getMaxCalendarId = (data) => {
        //             if (!data || data.length === 0) {
        //                 return null;
        //             }
        //             return Math.max(...data.map(event => event.m_calendar_id));
        //         };
        //         const maxCalendarId = getMaxCalendarId(res.data);
        //         console.log('m_calendar_id의 최대값:', maxCalendarId);
        //         setMCalendarIdMax(maxCalendarId);
        //         setMCalendarId(res.data.m_calendar_id);
        //     })
        //     .catch(error => console.log(error));

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

        console.log(selectedDate.toISOString().split("T")[0]);
        const formattedSelectedDate = selectedDate.toISOString().split("T")[0];
        console.log(m_calendar_id_max);
        // axios.get(`/membercalendar`)
        //     .then((res) => {
        //         console.log("오늘 날짜 (formattedSelectedDate):", formattedSelectedDate);
        //         const filteredData = res.data.filter(item => {
        //             return item.regdate.split(" ")[0] === formattedSelectedDate && item.memo === "식단";
        //         });
        //         console.log("필터링된 데이터 (오늘 날짜와 일치하는 항목):", filteredData);
        //         const mCalendarIds = filteredData.map(item => item.m_calendar_id);
        //         console.log("m_calendar_id 배열:", mCalendarIds);
        //         let mergedData = [];
        //         mCalendarIds.forEach(m_calendar_id => {
        //             axios.get(`/dietjournal/${m_calendar_id}`)
        //                 .then(res => {
        //                     console.log(res.data.list);
        //                     mergedData = mergedData.concat(res.data.list || []);
        //                     setSelect([...mergedData]);
        //                 })
        //                 .catch(error => {
        //                     console.error(`Diet Journal API 요청 실패 (m_calendar_id: ${m_calendar_id}):`, error);
        //                 });
        //         });
        //     })
        //     .catch(error => console.log(error));
    }, [token, selectedDate]);

    const handleChange = (e) => {
        setSearch(e.target.value);
    };

    const FoodHandleChange = (e) => {
        const { name, value } = e.target;
        setNewFood({
            ...newFood,
            [name]: value
        });
    };

    const handleClickAdd = () => {
        if (dietType === '선택') {
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
    };

    const dietListSearch = dietList.filter(data =>
        (data.food || "").toLowerCase().includes((search || "").toLowerCase())
    );

    const handleFoodDataAdd = () => {
        axios.post('/dietlist', {
            food: newFood.food,
            calories: parseInt(newFood.calories, 10),
            carbs: parseInt(newFood.carbs, 10),
            protein: parseInt(newFood.protein, 10),
            fat: parseInt(newFood.fat, 10)
        })
            .then(res => {
                console.log(res.data);
                if (res.data.isSuccess) {
                    alert("식단이 등록되었습니다");
                    navigate(`/member/dietjournal`);
                }
            })
            .catch(error => {
                console.log("데이터 전송 오류:", error);
                if (error.response) {
                    console.log("서버 응답 데이터:", error.response.data);
                }
                alert("식단 데이터 추가 실패!");
            });
    };

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

    })

    // const fetchUpdatedDietData = () => {
    //     try {
    //         const res = axios.get(`/dietjournal/${m_calendar_id}`);
    //         if (res.data) {
    //             console.log(res.data);
    //             const calendarRes = axios.get(`/membercalendar/${m_calendar_id}`);
    //             const filteredData = res.data.list.filter(item => {
    //                 const itemDate = new Date(item.date);
    //                 return itemDate.toISOString().split("T")[0] === selectedDate.toISOString().split("T")[0];
    //             });

    //             setSelect(filteredData.map(data => ({
    //                 diet_type: data.diet_type,
    //                 food: data.food,
    //                 calories: data.calories,
    //                 carbs: data.carbs,
    //                 protein: data.protein,
    //                 fat: data.fat,
    //                 foodcount: data.foodCount
    //             })));
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // const handleSubmit = () => {
    //     if (select.length === 0) {
    //         alert("추가된 식단이 없습니다.");
    //         return;
    //     }

    //     console.log("현재 d_journal_id:", d_journal_id);

    //     if (d_journal_id && d_journal_id !== "" && d_journal_id !== null) {
    //         console.log("수정 모드");

    //         axios.put(`/dietjournal/${d_journal_id}`, {
    //             m_calendar_id,
    //             diet: select.map(data => ({
    //                 diet_id: data.diet_id,
    //                 diet_type: data.diet_type,
    //                 foodCount: data.foodCount,
    //             }))
    //         })
    //             .then(res => {
    //                 console.log(res.data);
    //                 if (res.data.isSuccess) {
    //                     return fetchUpdatedDietData();
    //                 } else {
    //                     throw new Error("저장 실패");
    //                 }
    //             })
    //             .then(() => {
    //                 navigate(`/MemberDietJournal?date=${selectedDate.toISOString().split("T")[0]}`);
    //             })
    //             .catch(error => {
    //                 console.log("저장 중 오류 발생:", error);
    //                 alert(error.message || "저장 실패");
    //             });
    //     } else {
    //         console.log("새로 추가 모드");
    //         console.log(m_calendar_id_max);
    //         console.log("m_calendar_id_max의 타입:", typeof m_calendar_id_max);

    //         const requestData = select.map(data => ({
    //             m_calendar_id: m_calendar_id_max,
    //             diet_id: data.diet_id,
    //             diet_type: data.diet_type,
    //             foodCount: data.foodcount
    //         }));

    //         console.log("전송할 데이터:", requestData);
    //         console.log(`/dietjournal/${m_calendar_id_max}`);
    //         axios.post(`/dietjournal/${m_calendar_id_max}`, requestData, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             }
    //         })
    //             .then(res => {
    //                 console.log("응답데이터:", res.data);
    //                 if (res.data.isSuccess) {
    //                     alert('식단 정보가 성공적으로 저장되었습니다.');
    //                     console.log(selectedDate.toISOString().split("T")[0]);

    //                     const diet_add_to_calendar = {
    //                         m_calendar_id: m_calendar_id_max,
    //                         memo: "식단",
    //                         regdate: selectedDate.toISOString().split("T")[0],
    //                     };
    //                     console.log(diet_add_to_calendar);

    //                     axios.post('/membercalendar', diet_add_to_calendar)
    //                         .then((res) => {
    //                             console.log(m_calendar_id_max);
    //                             console.log("newEvent", diet_add_to_calendar);
    //                             if (res.data.isSuccess) {
    //                                 console.log("날짜", selectedDate);
    //                                 const requestData1 = select.map(data => ({
    //                                     m_calendar_id: m_calendar_id_max,
    //                                     diet_id: data.diet_id,
    //                                     diet_type: data.diet_type,
    //                                     foodCount: data.foodcount
    //                                 }));

    //                                 const apiUrl = `/dietjournal/${m_calendar_id_max}`;
    //                                 console.log("API 호출 주소:", apiUrl);
    //                                 console.log(requestData1);
    //                                 axios.post(`/dietjournal/${m_calendar_id_max}`, requestData1)
    //                                     .then(temp_res => {
    //                                         console.log("Res", temp_res.data);
    //                                     })
    //                                     .catch(error => {
    //                                         console.log(error);
    //                                         alert("저장 에러");
    //                                     });
    //                             }
    //                         })
    //                         .catch(error => {
    //                             console.log(error);
    //                             alert("저장 에러");
    //                         });
    //                 } else {
    //                     throw new Error("저장 실패");
    //                 }
    //             })
    //             .catch(error => {
    //                 if (error.response) {
    //                     console.log("오류 응답 데이터:", error.response.data);
    //                     console.log("오류 상태 코드:", error.response.status);
    //                     console.log("오류 헤더:", error.response.headers);
    //                 } else if (error.request) {
    //                     console.log("요청 데이터:", error.request);
    //                 } else {
    //                     console.log("오류 메시지:", error.message);
    //                 }
    //                 console.log("오류 설정:", error.config);
    //                 alert(error.message || "저장 실패");
    //             });
    //     }
    // };

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
                <Col>
                    <Card>
                        <Card.Header>식단추가</Card.Header>
                        <Card.Body>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>음식</th>
                                        <th>칼로리 (kcal)</th>
                                        <th>탄수화물 (g)</th>
                                        <th>단백질 (g)</th>
                                        <th>지방 (g)</th>
                                        <th>추가</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Form.Control
                                                name="food"
                                                placeholder="음식"
                                                value={newFood.food}
                                                onChange={FoodHandleChange}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                name="calories"
                                                type="number"
                                                placeholder="kcal"
                                                value={newFood.calories}
                                                onChange={FoodHandleChange}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                name="carbs"
                                                type="number"
                                                placeholder="g"
                                                value={newFood.carbs}
                                                onChange={FoodHandleChange}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                name="protein"
                                                type="number"
                                                placeholder="g"
                                                value={newFood.protein}
                                                onChange={FoodHandleChange}
                                            />
                                        </td>
                                        <td>
                                            <Form.Control
                                                name="fat"
                                                type="number"
                                                placeholder="g"
                                                value={newFood.fat}
                                                onChange={FoodHandleChange}
                                            />
                                        </td>
                                        <td>
                                            <Button onClick={handleFoodDataAdd}>추가</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    <Card>
                        <Card.Header as="h6" className="border-bottom p-3 mb-0">식단선택</Card.Header>
                        <Card.Body>
                            <InputGroup className="mb-3">
                                <DropdownButton
                                    variant="outline-secondary"
                                    title={dietType}
                                    id="input-group-dropdown-1"
                                >
                                    <Dropdown.Item onClick={() => setDietType('아침')}>아침</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setDietType('점심')}>점심</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setDietType('저녁')}>저녁</Dropdown.Item>
                                </DropdownButton>
                                <Form.Control onChange={handleChange} placeholder="식단검색" type="text" />
                            </InputGroup>
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
                                                    min="1"
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
                            <Button onClick={handleClickAdd} className="ms-2">식단 추가</Button>
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
                </Col>
            </Row>
        </div>
    );

}

export default MemberDietJournalAdd;