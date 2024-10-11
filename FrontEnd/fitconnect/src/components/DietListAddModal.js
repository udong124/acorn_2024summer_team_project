import axios from 'axios';
import React, { useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { Form, useNavigate } from 'react-router-dom';

function DietListAddModal() {

    //새로운 음식 추가 후 dietAdd 페이지로 이동을 위한 hook
    const navigate = useNavigate();

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

    return (
        <>
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
        </>
    );
}

export default DietListAddModal;