import { Button, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import user1 from "../assets/images/users/user4.jpg";
import probg from "../assets/images/bg/download.jpg";
import { FcCalendar, FcViewDetails } from "react-icons/fc";

const Sidebar = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };

  // 현재 경로 가져오기
  const location = useLocation();

  // 경로에 따라 다른 네비게이션 메뉴 설정
  let navigation = [];

  if (location.pathname.startsWith("/member")) {
    // 멤버 관련 경로일 때 보여줄 메뉴 설정
    navigation = [
      { title: "Dashboard", href: "/member", icon: "bi bi-speedometer2" },
      { title: "Member MyPage", href: "/member/mypage", icon: "bi bi-link" },
      { title: "Member Calendar", href: "/member/calendar", icon: <FcCalendar /> },
      { title: "Diet Journal", href: "/member/dietjournal/:m_calendar_id", icon: <FcViewDetails /> },
      { title: "Add Diet", href: "/member/dietadd/:m_calendar_id/:d_journal_id?", icon: <FcViewDetails /> },
      { title: "Add Exercise", href: "/member/exerciseadd/:m_calendar_id/:e_journal_id?", icon: <FcViewDetails /> },
      { title: "Exercise", href: "/member/exercise/:m_calendar_id", icon: <FcViewDetails /> }
    ];
  } else if (location.pathname.startsWith("/tr")) {
    // 트레이너 관련 경로일 때 보여줄 메뉴 설정
    navigation = [
      { title: "MainPage", href: "/trainer", icon: "bi bi-speedometer2" },
      { title: "캘린더", href: "/trainer/calendar", icon: "bi bi-people" },
      { title: "메신저", href: "/trainer/message", icon: "bi bi-list-task" },
      { title: "회원목록", href: "/trainer/members", icon: "bi bi-calendar-event" },
      { title: "마이페이지", href: "/trainer/mypage", icon: "bi bi-calendar-event" },
      { title: "MypageDetail", href: "/trainer/mypagedetail", icon: "bi bi-calendar-event" },
    ];
  } else {
    // 로그인 또는 회원가입 경로일 때 보여줄 메뉴 설정
    navigation = [
      { title: "Login", href: "/login", icon: "bi bi-box-arrow-in-right" },
      { title: "Sign Up", href: "/signup", icon: "bi bi-person-plus" }
    ];
  }
/* 이 밑은 사이드의 프로필빼고는 건들일이.. */
  return (
    <div>
      <div className="d-flex align-items-center"></div>
      <div className="profilebg" style={{ background: `url(${probg}) no-repeat` }}>
        <div className="p-3 d-flex">
          <img src={user1} alt="user" width="50" className="rounded-circle" />
          <Button
            variant="white"
            className="ms-auto text-white d-lg-none"
            onClick={showMobilemenu}
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
        {/* 경로에 따라 동적 사용자 정보 표시 */}
        <div className="bg-dark text-white p-2 opacity-75">
        </div>
      </div>
      <div className="p-3 mt-2">
        <Nav className="sidebarNav flex-column">
          {/* 네비게이션 메뉴 렌더링 */}
          {navigation.map((navi, index) => (
            <Nav.Item key={index} className="sidenav-bg">
              <Nav.Link
                as={Link}
                to={navi.href}
                className={
                  location.pathname === navi.href
                    ? "active nav-link py-3"
                    : "nav-link text-secondary py-3"
                }
              >
                {/* JSX 아이콘과 문자열 아이콘을 구분하여 렌더링 */}
                {typeof navi.icon === 'string' ? (
                  <i className={navi.icon}></i>
                ) : (
                  navi.icon
                )}
                <span className="ms-3 d-inline-block">{navi.title}</span>
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
