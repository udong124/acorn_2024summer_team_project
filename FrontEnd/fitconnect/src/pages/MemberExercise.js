//운동 일지조회관련 (사진이랑 운동순서때문에 잠시후)
//운동순서 ㄱㅏ져오기
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Card,Button,Row,Col, Modal,Dropdown,DropdownButton, InputGroup, Form, Table} from "react-bootstrap";
import { useParams } from "react-router-dom";

function MemberExercise(){

    const {m_calendar_id} = useParams()
    const {e_journal_id} = useParams()
    const {exercise_id} = useParams()

    const [date,setDate] = useState({})//나중에 넣을 날짜관련
    const [formData,setFormData]=useState([ //아직은 목업넣음
        {   exercise_id:1212,
            e_journal_id: 1,
            exercise_name: "벤치프레스",
            exercise_weight: 40,
            exercise_count: 9,
            exercise_set: 3,
            exercise_order:3
        },
            {   exercise_id:1212,
                e_journal_id: 1,
                exercise_name: "스쿼트",
                exercise_weight: 60,
                exercise_count: 9,
                exercise_set: 3,
                exercise_order:1
            },
                {   exercise_id:1212,
                    e_journal_id: 1,
                    exercise_name: "데드",
                    exercise_weight: 50,
                    exercise_count: 9,
                    exercise_set: 3,
                    exercise_order:2
                }
    ])

    const token = localStorage.getItem('token')

    //일단 사진관련땜에 useEffect에다가 get해서 가져옴
    useEffect(()=>{
        axios.get(`/exercisejournal/${e_journal_id}`)
        .then(res=>setFormData(res.data))
        .catch(error=>{console.log(error)})
    },[token, e_journal_id])

    const handleDelete= ()=>{
        axios.delete(`/exercisejournal/${exercise_id}/${e_journal_id}`)
        .then(res=>{
            if(res.data){
                const updatedSelect = formData.filter(item => item.exercise_id !== exercise_id)
                setFormData(updatedSelect)
            }
        })
        .catch(error=>{console.log(error)})
    }

    const handleDeleteAll = ()=>{
        axios.delete(`/exercisejournal/${m_calendar_id}`)
        .then(res=>{ if(res.data)setFormData([])})
        .catch(error=>{console.log(error)})
    }
    

return(
    <Row>
    <Col md={48} lg={40}>
    <Card className="">
      <Card.Header as="h6" className="border-bottom p-3 mb-0">
            <div className="d-flex justify-content-end mb-3">
              <Button variant="secondary" className="me-2">reserve</Button>
              <Button onClick={handleDeleteAll} variant="secondary">Delete</Button>
            </div>
       </Card.Header>

        <Card.Body>
        <Table bordered >
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
                {formData.map((data)=>(
                    <tr key={data.e_journal_id}>
                        <td>{data.exercise_name}</td>
                        <td>{data.exercise_weight}</td>
                        <td>{data.exercise_count}</td>
                        <td>{data.exercise_set}</td>
                        <td>{data.exercise_order}</td>
                        <td><Button onClick={()=>handleDelete(data.exercise_id)}>삭제</Button></td>
                    </tr>
                ))}
            </tbody>
        </Table>
        </Card.Body>
      </Card>
    </Col>
  </Row>
  )
}

export default MemberExercise