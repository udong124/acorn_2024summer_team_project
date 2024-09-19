import './App.css'
import Header from './layout/Header.js'
import Footer from './layout/Footer.js'

function App() {

  return (
    <>
      <div className='MainBackGround'>
        <video autoPlay loop muted>
          <source src={`${process.env.PUBLIC_URL}/health_main.mp4`} type='video/mp4'/>
        </video>
      </div>
      <div className='Header'><Header/></div>
      <div className='Content'>
        <h4>백만스물하나 백만스물둘</h4>
        <h1>운동 해야지</h1>
        <h5>운동은 FitConnect</h5>
        <p>FitConnect</p>
        <h1>문구문구문구문</h1>
        <h5>문구문구문구</h5>
      </div>
      <div className="Footer"><Footer/></div>
    </>
  );
}

export default App;
