import axios from 'axios';
import React, { useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

function DietListAddModal({ showModal, setShowModal }) {

    //새로운 음식 추가 후 dietAdd 페이지로 이동을 위한 hook
    const navigate = useNavigate();

    // const location = useLocation();
    // const { regdate }= location.state || {};

    // // 오늘 날짜
    // const today = new Date();
    // const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // // location 넘어올 경우 날짜
    // const initialDateStr = regdate ? regdate : localDate;
    // const initialDate = new Date(initialDateStr);
    // const [selectedDate, setSelectedDate] = useState(initialDate);
    // const [formattedDate, setFormattedDate] = useState();

    // const token = localStorage.getItem('token');

    // 새로 추가할 음식 값을 관리
    const [newFood, setNewFood] = useState({
        food: "",
        calories: "",
        carbs: "",
        protein: "",
        fat: ""
    });


    // 음식 내용을 담았을때 change 이벤트
    const FoodHandleChange = (e) => {
        const { name, value } = e.target;
        setNewFood({
            ...newFood,
            [name]: value
        });
    };

    // 음식 추가 버튼을 눌렀을 때 실행할 함수
    const handleFoodDataAdd = () => {
        axios.post('/dietlist', {
            food: newFood.food,
            calories: parseInt(newFood.calories, 10),
            carbs: parseInt(newFood.carbs, 10),
            protein: parseInt(newFood.protein, 10),
            fat: parseInt(newFood.fat, 10)
        })
        .then(res => {
            if (res.data.isSuccess) {
                alert("식단이 등록되었습니다");
                setShowModal(false); // 모달 숨기기
                navigate(0); // 페이지 이동


            }
        })
        .catch(error => {
            console.log("데이터 전송 오류:", error);
            alert("식단 데이터 추가 실패!");
        });
    };
    return (
        <Modal show={showModal} onHide={() => {
            setShowModal(false);
        }}>
            <Modal.Header>
                <Modal.Title>식단추가</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{fontFamily:'nanumsquare', fontWeight:700}}>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>음식</th>
                            <th>칼로리 (kcal)</th>
                            <th>탄수화물 (g)</th>
                            <th>단백질 (g)</th>
                            <th>지방 (g)</th>
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
                        </tr>
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer><Button onClick={handleFoodDataAdd}>추가</Button></Modal.Footer>
        </Modal>

    );
}

export default DietListAddModal;