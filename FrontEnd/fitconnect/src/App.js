import { useOutlet } from 'react-router';
import './App.css'
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';




function App() {

  //현재 route 된 정보를 출력해주는 hook
  const currentOutlet = useOutlet()
  return (

    <>
      <Navbar/>
      <div className='content-area'>
        <div className='maincontent'>{currentOutlet}</div>
      </div>
    </>
  );
}

export default App;
