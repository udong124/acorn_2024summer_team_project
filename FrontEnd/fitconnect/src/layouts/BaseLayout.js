import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Container } from "react-bootstrap";

const BaseLayout = () => {
  const location = useLocation();

  // 현재 경로에 따라 헤더나 사이드바의 내용이 변경되도록 설정
  const getLayoutConfig = () => {
    if (location.pathname.startsWith("/mem")) {
      return { showSidebar: true, showContent: true };
    } 
    else if (location.pathname.startsWith("/tr")) {
      return { showSidebar: true, showContent: true };
    } 
    else {
      return { showSidebar: false, showContent: true ,}; // 기본 페이지
    }
  };

  const { headerTitle, showSidebar, showContent } = getLayoutConfig();

  return (
    <main>
      {/******** Header ********/}
      <Header title={headerTitle} />
      <div className="pageWrapper d-lg-flex">
        {/******** Sidebar (로그인 페이지에서는 사이드바를 숨김) ********/}
        {showSidebar && (
          <aside className="sidebarArea shadow" id="sidebarArea">
            <Sidebar />
          </aside>
        )}
        {/******** Content Area (로그인 페이지에서는 내부 콘텐츠 숨김) ********/}
        {showContent && (
          <div className="contentArea">
            <Container className="p-4" fluid>
              <Outlet /> {/* 각 페이지의 내용이 여기에 렌더링 */}
            </Container>
          </div>
        )}
      </div>
    </main>
  );
};

export default BaseLayout;
