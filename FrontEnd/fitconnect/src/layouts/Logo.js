import { useEffect, useState } from "react";
import { ReactComponent as LogoDark } from "../assets/images/logos/FitConnectLogo.svg";
import { Link } from "react-router-dom";

const Logo = () => {
  let role ;
  const getRole = localStorage.getItem("role");
  if (getRole === "MEMBER" || getRole === "TRAINER"){
    role = getRole.toLowerCase();
  } else {
    role = null
  }

  return (
    <>
      { 
      <Link to={role}>
        <LogoDark />
      </Link>
      }
    </>
  );
};

export default Logo;
