//운동 일지조회관련 (사진이랑 운동순서때문에 잠시후)
//운동순서 ㄱㅏ져오기
import axios from "axios";
import { useEffect, useState } from "react";
import { Card,Button,Row,Col, Table, CardHeader} from "react-bootstrap";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

function MemberExercise(){

    const {m_calendar_id, e_journal_id, exercise_id} = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const selectedDate = queryParams.get("date")
    const [exerciseData, setExerciseData] = useState([])

    const [formData,setFormData]=useState([])

    const token = localStorage.getItem('token')

    useEffect(()=>{
        axios.get(`/exercisejournal/${e_journal_id}`)
        .then(res=>{
            const filteredData = res.data.filter(item=>item.regdate === selectedDate)
            setFormData(filteredData)})
        .catch(error=>{console.log(error)})
    },[token, e_journal_id,selectedDate])

    const handleDelete= (exercise_id)=>{
        axios.delete(`/exercisejournal/${exercise_id}/${e_journal_id}`)
        .then((res)=>{
            if(res.data.isSuccess){
                const updatedSelect = formData.filter(item => item.exercise_id !== exercise_id)
                setFormData(updatedSelect)
            }else{
                console.log(res.data)
                alert("삭제실패")
            }
        })
        .catch(error=>{console.log(error)})
    }

    const handleDeleteAll = (m_calendar_id)=>{
        axios.delete(`/exercisejournal/${m_calendar_id}`)
        .then(res=>{ if(res.data)setFormData([]); Navigate('/mem/MemberExercise')})
        .catch(error=>{console.log(error); alert("삭제실패")})
    }
    
    const handleReserve = () =>{
        navigate('/mem/MemberExerciseAdd')
        //나중에 뒤에 번호 붙이는 그런걸로 바꿀
    }

return(
    <Row>
    <Col>
      <Card>
      <Card.Header as="h6" className="border-bottom p-3 mb-0"><h1>{selectedDate}의 운동</h1></Card.Header>
      </Card>
    </Col>

    <Col md={48} lg={40}>
    <Card className="">
      <Card.Header as="h6" className="border-bottom p-3 mb-0">
            <div className="d-flex justify-content-end mb-3">
              <Button onClick={handleReserve} variant="secondary" className="me-2">reserve</Button>
              <Button onClick={()=>handleDeleteAll(m_calendar_id)} variant="secondary">Delete</Button>
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
                {[...formData]
                    .sort((a, b) => a.exercise_order - b.exercise_order)
                    .map((data) => (
                        <tr key={data.exercise_id}> {/* e_journal_id 대신 exercise_id 사용 */}
                            <td>{data.exercise_name}</td>
                            <td>{data.exercise_weight}</td>
                            <td>{data.exercise_count}</td>
                            <td>{data.exercise_set}</td>
                            <td>{data.exercise_order}</td>
                            <td>
                                <Button onClick={() => handleDelete(data.exercise_id)} variant="outline-danger" >삭제</Button>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
        </Card.Body>
      </Card>
    </Col>
  </Row>
  )
}

export default MemberExercise