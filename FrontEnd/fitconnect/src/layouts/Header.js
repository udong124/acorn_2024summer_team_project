import React, { useEffect, useState } from "react";
import { Navbar, Nav, Button, Dropdown } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { ReactComponent as LogoWhite } from "../assets/images/logos/FitConnectLogo.svg";
import user1 from "../assets/images/users/user4.jpg";
import { decodeToken } from "jsontokens";
import './css/Header.css'; // 커스텀 CSS 파일 임포트


const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [userName, setUserName] = useState(""); //로그인 후 표시를 위한 userName
  const location = useLocation(); // 현재 경로 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 설정
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("token"); // 로그인 토큰 삭제
    localStorage.removeItem("userName"); //-로그인중 사라지도록 삭제
    localStorage.removeItem("role");
    localStorage.removeItem("userRole");
    localStorage.removeItem("name");
    localStorage.removeItem("memberInfo");
    setUserName(null); //-상태 원래되로
    navigate("/login"); // 로그인 페이지로 리다이렉트
  };

   // 로그인/회원가입 페이지 여부 확인
   const isAuthPage = location.pathname.startsWith("/login") || location.pathname.startsWith("/signup") || location.pathname.startsWith("/membersignup") || location.pathname.startsWith("/trainersignup");

  //로그인 중 표시를 위하여 로그인 된 사용자이름을 가져오기
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      setUserName(null);
    }
  }, [location]);

  const role = localStorage.getItem("role");
  let navbarBrand;
  if (!isAuthPage && role === "MEMBER"){
    navbarBrand = (
      <Navbar.Brand href="/member">
        <LogoWhite className="d-lg-none" />
      </Navbar.Brand>
    );
  } else if (!isAuthPage && role === "TRAINER"){
    navbarBrand = (
      <Navbar.Brand href="/trainer">
        <LogoWhite className="d-lg-none" />
      </Navbar.Brand>
    );
  } else if (!isAuthPage && role === "ADMIN"){
    navbarBrand = (
      <Navbar.Brand href="/">
        <LogoWhite className="d-lg-none" />
      </Navbar.Brand>
    );
  }else {
      navbarBrand = (
        <Navbar.Brand href="" onClick={(e)=> e.preventDefault()}>
          <LogoWhite className="d-lg-none"/>
        </Navbar.Brand>
    );
  }

  return (
    <Navbar
      className="custom-navbar"
      expand="md"
      expanded={isOpen}
    >
      <div className="d-flex align-items-center">

        
        {/* 로그인 페이지에서는 이 버튼이 나타나지 않도록 조건부 렌더링 */}
        {!isAuthPage && userName && (
          <Button style={{}} variant="dark" className="d-lg-none" onClick={showMobilemenu}>
            <i className="bi bi-list"></i>
          </Button>
        )}

      <div style={{marginLeft: 60}}>
         <Logo />
      </div>

      </div>

      <div className="hstack gap-2">
        {/* 로그인 페이지에서는 이 버튼도 나타나지 않도록 설정 */}
        {!isAuthPage && userName && (
          <Button
            variant="danger"
            size="sm"
            className="d-sm-block d-md-none"
            onClick={Handletoggle}
          >
            <img src="/img/logout2.png" alt="" style={{width:18, height:18}}/>
          </Button>
        )}
      </div>

      <Navbar.Collapse>
        <Nav className="me-auto">{/* 빈 네비게이션 */}</Nav>

        {/* 로그인 여부에 따라 로그인,로그아웃 버튼 표시 */}
        { !isAuthPage && userName ? (
          <>
            <span style={{ color: "#fff", marginRight:"20px"  }}>{localStorage.getItem("name")} 님 로그인 중</span>
            <Button
            variant="danger"
            style={{ zIndex: 0, position: 'relative', marginRight:"100px"}} // 인라인 스타일로 z-index 적용
            onClick={handleLogout}
            >
              <img src="/img/logout2.png" alt="" style={{width:18, height:18}}/>
            </Button>
          </>
        ) : ""}
        { !isAuthPage && userName ? (
          <Dropdown show={dropdownOpen} onToggle={toggle}>

          </Dropdown>): ""}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;