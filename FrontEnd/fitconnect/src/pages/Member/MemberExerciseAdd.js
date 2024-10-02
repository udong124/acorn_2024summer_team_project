import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, Button, Row, Col, Dropdown, DropdownButton, InputGroup, Form, Table } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function MemberExerciseAdd() {
  const { exercise_category } = useParams();

  const [exerciseCatecory, setExerciseCatecory] = useState("전체"); // 운동목록 선택
  const [exerciseData, setExerciseData] = useState([]);
  const [selectIndex, setSelectIndex] = useState({});
  const [search, setSearch] = useState(""); // 검색
  const [selectExercise, setSelectExercise] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // 운동 조회
    axios
      .get("/exerciselise")
      .then((res) => setExerciseData(res.data))
      .catch((error) => console.log(error));
  }, []);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const exerciseSearch = exerciseData.filter((data) => data.exercise_name.toLowerCase().includes(search.toLowerCase()));

  const selectCategory = () => {
    axios
      .get(`/exerciselist/${exercise_category}`)
      .then((res) => res.data) // 임시
      .catch((error) => console.log(error));
  };

  const handleNextStep = (exercise_id, exercise_name, exercise_category, exercise_info, saveImage) => {
    axios
      .post("/exerciselist")
      .then((res) => res.data)
      .catch((error) => console.log(error));
  };

  // 드래그가 끝났을 때 호출되는 함수
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(selectExercise);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectExercise(items);
  };

  return (
    <Row>
      <Col md={48} lg={40}>
        <Card className="">
          <Card.Body>
            <InputGroup className="mb-3">
              <DropdownButton variant="outline-secondary" title={exerciseCatecory} id="input-group-dropdown-1">
                <Dropdown.Item onClick={() => setExerciseCatecory("전체")}>전체</Dropdown.Item>
                <Dropdown.Item onClick={() => setExerciseCatecory("등")}>등</Dropdown.Item>
                <Dropdown.Item onClick={() => setExerciseCatecory("가슴")}>가슴</Dropdown.Item>
                <Dropdown.Item onClick={() => setExerciseCatecory("어깨")}>어깨</Dropdown.Item>
                <Dropdown.Item onClick={() => setExerciseCatecory("하체")}>하체</Dropdown.Item>
                <Dropdown.Item onClick={() => setExerciseCatecory("복근")}>복근</Dropdown.Item>
                <Dropdown.Item onClick={() => setExerciseCatecory("삼두")}>삼두</Dropdown.Item>
                <Dropdown.Item onClick={() => setExerciseCatecory("이두")}>이두</Dropdown.Item>
                <Dropdown.Item onClick={() => setExerciseCatecory("전신")}>전신</Dropdown.Item>
              </DropdownButton>
              <Form.Control onChange={handleChange} placeholder="운동목록 검색" type="text" />
            </InputGroup>
            <Table bordered>
              <tbody>
                {exerciseSearch.map((data, index) => (
                  <tr
                    key={data.exercise_id}
                    onClick={() => setSelectIndex(index)}
                    className={selectIndex === index ? "table-active" : ""}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{data.exercise_name}</td>
                    <td>{exerciseData[index]?.calories || data.calories}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>

      <Col md={48} lg={40}>
        <Card className="">
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
                        <th>운동명</th>
                        <th>무게</th>
                        <th>횟수</th>
                        <th>세트</th>
                        <th>순서</th>
                        <th>삭제 여부</th>
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
                              <td>{data.exercise_weight}</td>
                              <td>{data.exercise_count}</td>
                              <td>{data.exercise_set}</td>
                              <td>{index + 1}</td>
                              <td>
                                <Button onClick={() => setSelectExercise(selectExercise.filter((item) => item.e_journal_id !== data.e_journal_id))}>
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
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default MemberExerciseAdd;
