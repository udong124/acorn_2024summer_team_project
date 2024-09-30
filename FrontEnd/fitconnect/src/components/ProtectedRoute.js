// src/components/ProtectedRoute.js

import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { useEffect, useState } from 'react';
import LoginModal from './LoginModal'; 
import MemberModal from './MemberModal';
import TrainerModal from './TrainerModal';
import AdminModal from './AdminModal';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const isLogin = useSelector(state => state.userName) ? true : false;
    const userRole = useSelector(state => state.role); // 현재 사용자의 역할 (MEMBER,TRAINER,ADMIN)

    const location = useLocation();
    const navigate = useNavigate(); // useNavigate 추가
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false); 
    const [activeModal, setActiveModal] = useState(null); // 현재 표시될 모달 관리

    useEffect(() => {
        // 로그인이 되어 있지 않은 경우
        if (!isLogin) {
            const payload = {
                show: true,
                message: "해당 페이지는 로그인이 필요합니다!",
                url: location.pathname + location.search
            };
            dispatch({ type: "LOGIN_MODAL", payload });
            setActiveModal('login'); // 로그인 모달 활성화
            setShowModal(true); 
        } 
        // 사용자의 role이 allowedRoles에 포함되어 있지 않은 경우
        else if (allowedRoles && !allowedRoles.includes(userRole)) {
            const payload = {
                show: true,
                message: `해당 페이지는 ${allowedRoles.join(', ')} 전용 페이지입니다!`,
                url: location.pathname
            };
            dispatch({ type: "ACCESS_DENIED_MODAL", payload });
            setShowModal(true);

            // role에 따라 표시할 모달 설정
            switch (allowedRoles[0]) {
                case 'MEMBER':
                    setActiveModal('MEMBER');
                    break;
                case 'TRAINER':
                    setActiveModal('TRAINER');
                    break;
                case 'ADMIN':
                    setActiveModal('ADMIN');
                    break;
                default:
                    setActiveModal(null);
                    break;
            }
        } else {
            setShowModal(false); // 올바른 접근 시 모달 비활성화
        }
    }, [isLogin, userRole, allowedRoles, location.pathname, location.search, dispatch]); // location.search 추가

    // 모달 닫기 및 메인 페이지로 리다이렉트
    const handleModalClose = () => {
        setShowModal(false);
        dispatch({ type: "HIDE_MODAL" });
        navigate('/'); // 확인 버튼 클릭 시 메인 페이지로 리다이렉트
    };

    // 모달이 표시되면 children이 렌더링되지 않도록 처리
    if (showModal) {
        switch (activeModal) {
            case 'login':
                return <LoginModal isOpen={showModal} onClose={handleModalClose} />;
            case 'MEMBER':
                return <MemberModal isOpen={showModal} onClose={handleModalClose} />;
            case 'TRAINER':
                return <TrainerModal isOpen={showModal} onClose={handleModalClose} />;
            case 'ADMIN':
                return <AdminModal isOpen={showModal} onClose={handleModalClose} />;
            default:
                return null;
        }
    }

    return children;
};

export default ProtectedRoute;
