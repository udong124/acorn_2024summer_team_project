import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button, Row, Col, Dropdown, DropdownButton, InputGroup, Form, Table, Modal, Alert } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

function MemberExerciseAdd() {
  const { exercise_category, exercise_id, m_calendar_id } = useParams();

  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const initialDate = queryParams.get("date") ? new Date(queryParams.get("date")) : new Date()
  const [selectedDate, setSelectedDate] = useState(initialDate)

  const [exerciseCategory, setExerciseCategory] = useState("전체"); // 운동목록 선택
  const [exerciseData, setExerciseData] = useState([]);
  const [search, setSearch] = useState(""); // 검색
  const [selectExercise, setSelectExercise] = useState([]);

  // 모달관련
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // 체크박스 옵션관련
  const [showDetailsOption, setShowDetailsOption] = useState(false);

  useEffect(() => {
    const category = exerciseCategory === "전체" ? "" : `/${exerciseCategory}`;

    axios.get(`/exerciselist${category}`)
      .then((res) => {setExerciseData(res.data)})
      .catch((error) => {console.error("운동목록 불러오기 실패", error)});
  }, [exerciseCategory]); // 카테고리가 변경될때마다 데이터 가져오기

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
      axios.get(`/exercisejournal/${m_calendar_id}`)
      .then(res=>{
        if(res.data){
          setSelectExercise(res.data)
        }}
      ).catch(error=>console.log(error))
  },[m_calendar_id])

  const exerciseSearch = Array.isArray(exerciseData) 
  ? exerciseData.filter((data) =>
      data.exercise_name.toLowerCase().includes(search.toLowerCase())
    )
  : [];

  const handleExerciseDetail = (exercise_id) => {
    axios.get(`/exerciselist/${exercise_id}`)
    .then(res=>{
      setModalData(res.data);
      setShowModal(true);
    })
    .catch(error=>console.log(error))

  };

  const handleCardClick = (exercise) => {
    setSelectExercise([...selectExercise, { ...exercise, e_journal_id: `ej_${exercise.exercise_id}_${new Date().getTime()}` }])
    if (showDetailsOption) {
      handleExerciseDetail(exercise);
    }
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(selectExercise);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectExercise(items);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  const handleInputChange = (e, id, field) => {
    setSelectExercise((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.e_journal_id === id ? { ...exercise, [field]: e.target.value } : exercise
      )
    )
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    const formattedDate = date.toISOString().split("T")[0]
    queryParams.set("date",formattedDate)
    navigate(`?date=${formattedDate}`)
  }

  const handleSubmit = () => {
    console.log("작동함")
    selectExercise.forEach((exercise) => {
      axios.post("/exerciselist", { selectedExercise: [exercise] })
        .then(() => {
          if (exercise.e_journal_id) {
            console.log("수정할 운동:", exercise.e_journal_id);
            return axios.post(`/exercisejournal/${exercise.e_journal_id}`, {
              exercise_id: exercise.exercise_id,
              exercise_set: exercise.exercise_set,
              exercise_count: exercise.exercise_count,
              exercise_order: exercise.exercise_order,
              exercise_weight: exercise.exercise_weight,
            })
          }
        })
        .then(() => {
          navigate(`/MemberDietJournal?date=${selectedDate.toISOString().split("T")[0]}`)
          console.log("운동 추가 및 수정 완료");
          alert("저장");
        })
        .catch((error) => {
          console.error("에러 발생:", error);
          alert("에러발생");
        });
    });
  };  
  

  return (
    <>
      <Row>
        <Col md={6} lg={5}>
          <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0">
              운동 추가하기
            </Card.Header>
            <Card.Body>
              <InputGroup className="mb-3">
                <DropdownButton variant="outline-secondary" title={exerciseCategory} id="input-group-dropdown-1">
                  <Dropdown.Item onClick={() => setExerciseCategory("전체")}>전체</Dropdown.Item>
                  <Dropdown.Item onClick={() => setExerciseCategory("등")}>등</Dropdown.Item>
                  <Dropdown.Item onClick={() => setExerciseCategory("가슴")}>가슴</Dropdown.Item>
                  <Dropdown.Item onClick={() => setExerciseCategory("어깨")}>어깨</Dropdown.Item>
                  <Dropdown.Item onClick={() => setExerciseCategory("하체")}>하체</Dropdown.Item>
                  <Dropdown.Item onClick={() => setExerciseCategory("복근")}>복근</Dropdown.Item>
                  <Dropdown.Item onClick={() => setExerciseCategory("삼두")}>삼두</Dropdown.Item>
                  <Dropdown.Item onClick={() => setExerciseCategory("이두")}>이두</Dropdown.Item>
                  <Dropdown.Item onClick={() => setExerciseCategory("전신")}>전신</Dropdown.Item>
                </DropdownButton>
                <Form.Control onChange={handleChange} placeholder="운동목록 검색" type="text"/>
              </InputGroup>

              <Form.Group controlId="showDetailsCheckbox" className="mb-3">
                <Form.Check type="checkbox" label="운동 상세 보기" checked={showDetailsOption} onChange={(e) => setShowDetailsOption(e.target.checked)}/>
              </Form.Group>

                <Row>
                  {exerciseSearch.map((data) => (
                    <Col key={data.exercise_id} xs={12} sm={6} md={4} lg={4} className="mb-3">
                      <Card onClick={() => handleCardClick(data)} style={{ cursor: "pointer" }}
                        className={`h-100 ${selectExercise.find((item) => item.exercise_id === data.exercise_id) ? "border-primary" : ""}`}>
                        <Card.Img variant="top" src={data.saveImage} alt={data.exercise_name} style={{ height: "150px", objectFit: "cover" }}/>
                        <Card.Body className="d-flex justify-content-center align-items-center p-2">
                          <Card.Text className="text-center">{data.exercise_name}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col md={7} lg={6}>
          <Card>
            <Card.Header as="h6" className="border-bottom p-3 mb-0">
              선택한 운동목록
            </Card.Header>
            <Card.Body>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="exerciseList">
                  {(provided) => (
                    <Table bordered {...provided.droppableProps} ref={provided.innerRef}>
                      <thead className="text-center">
                        <tr>
                          <th style={{ width: "30%" }}>운동명</th>
                          <th style={{ width: "15%" }}>무게</th>
                          <th style={{ width: "15%" }}>횟수</th>
                          <th style={{ width: "15%" }}>세트</th>
                          <th style={{ width: "10%" }}>순서</th>
                          <th style={{ width: "15%" }}>삭제 여부</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {selectExercise.map((data, index) => (
                          <Draggable key={data.e_journal_id} draggableId={data.e_journal_id} index={index}>
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  backgroundColor: snapshot.isDragging ? "#f0f8ff" : "white",
                                }}
                              >
                                <td>{data.exercise_name}</td>
                                <td>
                                  <Form.Control type="number" value={data.exercise_weight || ""} placeholder="무게"
                                    onChange={(e) => handleInputChange(e, data.e_journal_id, "exercise_weight")}/>
                                </td>
                                <td>
                                  <Form.Control type="number" value={data.exercise_count || ""} placeholder="횟수"
                                    onChange={(e) => handleInputChange(e, data.e_journal_id, "exercise_count")}/>
                                </td>
                                <td>
                                  <Form.Control type="number" value={data.exercise_set || ""} placeholder="세트"
                                    onChange={(e) => handleInputChange(e, data.e_journal_id, "exercise_set")}/>
                                </td>
                                <td>{index + 1}</td>
                                <td>
                                  <Button variant="danger" size="sm"
                                    onClick={() => setSelectExercise(selectExercise.filter((item) => item.e_journal_id !== data.e_journal_id))}>
                                    삭제
                                  </Button>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </tbody>
                    </Table>
                  )}
                </Droppable>
              </DragDropContext>
              <Button onClick={handleSubmit}>저장</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData?.exercise_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={modalData?.saveImage} alt={modalData?.exercise_name} style={{ width: "100%", height: "auto", marginBottom: "15px" }}/>
          <p>{modalData?.exercise_info || "운동에 대한 상세 정보가 없습니다."}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MemberExerciseAdd;