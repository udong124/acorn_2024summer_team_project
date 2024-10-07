import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { useEffect, useState } from 'react';
import LoginModal from './LoginModal'; 
import MemberModal from './MemberModal';
import TrainerModal from './TrainerModal';
import AdminModal from './AdminModal';
import { decodeToken } from 'jsontokens'; 
   // 메시지 필드 초기화

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const isLogin = token ? true : false; // 로그인된 상태를 토큰의 유무로 알기

    // role, role 번호를 토큰에서 얻어오기
    const decodedToken = token ? decodeToken(token.replace('Bearer+', '')) : null;
    const userRole = decodedToken ? decodedToken.payload.userRole : null;
    const memberNum = decodedToken ? decodedToken.payload.member_num : null;
    const trainerNum = decodedToken ? decodedToken.payload.trainer_num : null;
    const adminNum = decodedToken ? decodedToken.payload.admin_num : null;

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false); 
    const [activeModal, setActiveModal] = useState(null); //어떤 모달을 뜨게 할지 

    // 토큰을 읽어올수있는지 (토큰 정보 확인)
    console.log('Decoded Token:', decodedToken);
    console.log('userRole:', userRole);
    console.log('memberNum:', memberNum);
    console.log('trainerNum:', trainerNum);
    console.log('adminNum:', adminNum);

    useEffect(() => {
        // 로그인이 되어 있지 않은 경우
        if (!isLogin) {
            const payload = {
                show: true,
                message: "해당 페이지는 로그인이 필요합니다!",
                url: location.pathname + location.search
            };
            dispatch({ type: "LOGIN_MODAL", payload });
            setActiveModal('login'); // 로그인 모달이 뜨도록
            setShowModal(true); 
        } 
        // role에 따라 접근할 수 없는 페이지에 못 들어가도록
        else if (allowedRoles && !allowedRoles.includes(userRole)) {
            const payload = {
                show: true,
                message: `해당 페이지는 ${allowedRoles.join(', ')} 전용 페이지입니다!`, // 접근 제한 메시지
                url: location.pathname
            };
            dispatch({ type: "ACCESS_DENIED_MODAL", payload });
            setShowModal(true);

            // 역할에 맞는 모달 띄우기
            if (userRole === 'MEMBER') {
                setActiveModal('MEMBER');
            } else if (userRole === 'TRAINER') {
                setActiveModal('TRAINER');
            } else if (userRole === 'ADMIN') {
                setActiveModal('ADMIN');
            } else {
                setActiveModal(null);
            }
        } else {
            setShowModal(false); // 올바른 접근 시 모달 비활성화
        }
    }, [isLogin, userRole, allowedRoles, location.pathname, location.search, dispatch]);

    // 모달 닫기 및 메인 페이지로 돌아가도록
    const handleModalClose = () => {
        setShowModal(false);
        dispatch({ type: "HIDE_MODAL" });
        navigate('/'); 
    };

    
    if (activeModal) {
        if (activeModal === 'login') {
            return <LoginModal isOpen={!!activeModal} onClose={handleModalClose} />;
        } else if (activeModal === 'MEMBER') {
            return <MemberModal isOpen={!!activeModal} onClose={handleModalClose} />;
        } else if (activeModal === 'TRAINER') {
            return <TrainerModal isOpen={!!activeModal} onClose={handleModalClose} />;
        } else if (activeModal === 'ADMIN') {
            return <AdminModal isOpen={!!activeModal} onClose={handleModalClose} />;
        }
        return null;
    }

    return children;
};

export default ProtectedRoute;