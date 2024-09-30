import React from "react";
import { Navbar, Nav, Button, Dropdown } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { ReactComponent as LogoWhite } from "../assets/images/logos/FitConnectLogo.svg";
import user1 from "../assets/images/users/user4.jpg";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
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
    navigate("/login"); // 로그인 페이지로 리다이렉트
  };

  // 로그인/회원가입 페이지 여부 확인
  const isAuthPage = location.pathname.startsWith("/login") || location.pathname.startsWith("/signup") ||location.pathname.startsWith("/userstart");

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="md"
      className="fix-header"
      expanded={isOpen}
    >
      <div className="d-flex align-items-center">
        <div className="d-lg-block d-none me-5 pe-3">
          <Logo />
        </div>
        <Navbar.Brand href="/">
          <LogoWhite className="d-lg-none" />
        </Navbar.Brand>
        {/* 로그인 페이지에서는 이 버튼이 나타나지 않도록 조건부 렌더링 */}
        {!isAuthPage && (
          <Button variant="dark" className="d-lg-none" onClick={showMobilemenu}>
            <i className="bi bi-list"></i>
          </Button>
        )}
      </div>

      <div className="hstack gap-2">
        {/* 로그인 페이지에서는 이 버튼도 나타나지 않도록 설정 */}
        {!isAuthPage && (
          <Button
            variant="dark"
            size="sm"
            className="d-sm-block d-md-none"
            onClick={Handletoggle}
          >
            {isOpen ? (
              <i className="bi bi-x"></i>
            ) : (
              <i className="bi bi-three-dots-vertical"></i>
            )}
          </Button>
        )}
      </div>

      <Navbar.Collapse>
        <Nav className="me-auto">
          {/* 빈 네비게이션 */}
        </Nav>
        {/* 경로에 따라 로그인/로그아웃 버튼 표시 */}
        {isAuthPage ? (
          <Button variant="light" onClick={() => navigate("/login")}>
            로그인
          </Button>
        ) : (
          <Button variant="danger" onClick={handleLogout}>
            로그아웃
          </Button>
        )}
        <Dropdown show={dropdownOpen} onToggle={toggle}>
          <Dropdown.Toggle variant="transparent">
            <img src={user1} alt="profile" className="rounded-circle" width="30" />
          </Dropdown.Toggle>
        </Dropdown>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
