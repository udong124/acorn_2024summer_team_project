import { ReactComponent as LogoDark } from "../assets/images/logos/FitConnectLogo.svg";
import { Link, useLocation } from "react-router-dom";

const Logo = () => {
  let role ;
  const getRole = localStorage.getItem("role");
  if (getRole === "MEMBER" || getRole === "TRAINER"){
    role = getRole.toLowerCase();
  } else {
    role = null
  }
  const location = useLocation(); // 현재 경로 가져오기
  const isAuthPage = location.pathname.startsWith("/login") || location.pathname.startsWith("/signup")

  return (
    <>
      { !isAuthPage ?
          <Link to={role}>
            <LogoDark />
          </Link>
        :
          <Link to={role}>
            <LogoDark style={{cursor:"default"}}/>
          </Link>
      }
    </>
  );
};

export default Logo;
