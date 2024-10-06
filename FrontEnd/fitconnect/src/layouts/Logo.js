import { useEffect, useState } from "react";
import { ReactComponent as LogoDark } from "../assets/images/logos/FitConnectLogo.svg";
import { Link } from "react-router-dom";

const Logo = () => {
  const [role, setRole] = useState(null);
  useEffect(()=>{
    setRole(localStorage.getItem("role").toLowerCase());
  })

  return (
    <Link to={role}>
      <LogoDark />
    </Link>
  );
};

export default Logo;
