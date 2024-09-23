import axios from "axios";
import { useEffect, useState } from "react";

function Members() {
  const [members, setMembers] = useState([]); 
  const [exerciseJournal, setExerciseJournal] = useState([]);
  const [exerciseGoal, setExerciseGoal] = useState({
    exercise_id: '',
    exercise_name: '',
    exercise_set: '',
    exercise_count: '',
    exercise_order: '',
    exercise_weight: ''
  });

 
  const getMembers = () => {
    axios.get(`/members`)
      .then(res => setMembers(res.data))
      .catch(err => console.log('Error fetching members:', err));
  };

  // 운동일지 가져오기
  const getExerciseJournal = (e_journal_id) => {
    axios.get(`/exerciseJournal/${e_journal_id}`)
      .then(res => setExerciseJournal(res.data))
      .catch(err => console.log('Error fetching exercise journal:', err));
  };

  // 운동일지 삭제
  const deleteExerciseJournal = (exercise_id, e_journal_id) => {
    axios.delete(`/exerciseJournal/${exercise_id}/${e_journal_id}`)
      .then(() => getExerciseJournal(e_journal_id)) 
      .catch(err => console.log('Error deleting exercise journal:', err));
  };

  // 운동일지 수정
  const updateExerciseJournal = (e_journal_id) => {
    axios.put(`/exerciseJournal/${e_journal_id}`)
      .then(() => getExerciseJournal(e_journal_id)) 
      .catch(err => console.log('Error updating exercise journal:', err));
  };

  // 운동일지 등록
  const registerExerciseGoal = () => {
    axios.post('/exerciseJournal', exerciseGoal) 
      .then(() => {
        setExerciseGoal({
          exercise_id: '',
          exercise_name: '',
          exercise_set: '',
          exercise_count: '',
          exercise_order: '',
          exercise_weight: ''
        }); 
        getExerciseJournal(); 
      })
      .catch(err => console.log('Error registering exercise goal:', err));
  };

  // 멤버 삭제 핸들러
  const handleDelete = (num) => {
    axios.delete(`/members/${num}`)
      .then(() => getMembers()) 
      .catch(err => console.log('Error deleting member:', err));
  };

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExerciseGoal({ ...exerciseGoal, [name]: value });
  };

  useEffect(() => {
    getMembers(); 
  }, []);

  return (
    <div>
      <h1>회원 목록</h1>
      <ul>
        {members.map(item => (
          <li key={item.member_num}>
            <p>이름: {item.name}</p>
            <p>프로필 이미지: {item.profile_image_url}</p>
            <p>키: {item.member_height}</p>
            <p>몸무게: {item.member_weight}</p>
            <p>성별: {item.member_gender}</p>
            <p>플랜: {item.member_plan}</p>
            <button variant="primary" onClick={() => handleDelete(item.member_num)}>삭제</button>
          </li>
        ))}
      </ul>

      <h2>운동 일지</h2>
      <ul>
        {exerciseJournal.map(item => (
          <li key={item.e_journal_id}>
            <p>운동 ID: {item.exercise_id}</p>
            <p>운동 이름: {item.exercise_name}</p>
            <p>세트: {item.exercise_set}</p>
            <p>개수: {item.exercise_count}</p>
            <p>순서: {item.exercise_order}</p>
            <p>무게: {item.exercise_weight}</p>
            <button onClick={() => deleteExerciseJournal(item.exercise_id, item.e_journal_id)}>삭제</button>
            <button onClick={() => updateExerciseJournal(item.e_journal_id)}>수정</button>
          </li>
        ))}
      </ul>

      <h2>운동 등록</h2>
      <form onSubmit={(e) => { e.preventDefault(); registerExerciseGoal(); }}>
        <input type="text" name="exercise_id" value={exerciseGoal.exercise_id} onChange={handleInputChange} placeholder="운동 ID" />
        <input type="text" name="exercise_set" value={exerciseGoal.exercise_set} onChange={handleInputChange} placeholder="세트" />
        <input type="text" name="exercise_count" value={exerciseGoal.exercise_count} onChange={handleInputChange} placeholder="개수" />
        <input type="text" name="exercise_order" value={exerciseGoal.exercise_order} onChange={handleInputChange} placeholder="순서" />
        <input type="text" name="exercise_weight" value={exerciseGoal.exercise_weight} onChange={handleInputChange} placeholder="무게" />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}

export default Members;
