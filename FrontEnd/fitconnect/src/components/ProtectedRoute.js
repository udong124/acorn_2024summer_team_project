import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; 
import { useEffect, useState } from 'react';
import LoginModal from './LoginModal'; 
import MemberModal from './MemberModal';
import TrainerModal from './TrainerModal';
import AdminModal from './AdminModal';
import { decodeToken } from 'jsontokens';
import axios from 'axios';


const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const isLogin = token ? true : false; // 로그인된 상태를 토큰의 유무로 알기

    // role을 토큰에서 얻어오기
    const decodedToken = token ? decodeToken(token.replace('Bearer+', '')) : null;
    // const userRole = decodedToken ? decodedToken.payload.userRole : null;

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false); 
    const [activeModal, setActiveModal] = useState(null);

    const [userRole, setUserRole] = useState()
    axios.get("/user",{ // 토큰을 통해 DB 에서 role 을 가져와 상태값으로 관리
        headers: {
            Authorization : token
        }
    })
    .then(res=>{
        setUserRole(res.data.role)
    })
    .catch(err=>{console.log(err)})


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
            // role에 따라 접근할 수 없는 페이지에 들어가지 못하도록
        else if (allowedRoles && !allowedRoles.includes(userRole)) {
            if(userRole){   //userRole 이 들어왔을 때 실행
                const payload = {
                    show: true,
                    message: `해당 페이지는 ${allowedRoles.join(', ')} 전용 페이지입니다!`, // 접근 제한 메시지
                    url: location.pathname
                };
                dispatch({ type: "ACCESS_DENIED_MODAL", payload });
                setShowModal(true);

                // 역할에 맞는 모달 띄우기
                if (!allowedRoles.includes(userRole)) {
                    if (allowedRoles.includes('MEMBER')) {
                        setActiveModal('MEMBER');
                    } else if (allowedRoles.includes('TRAINER')) {
                        setActiveModal('TRAINER');
                    } else if (allowedRoles.includes('ADMIN')) {
                        setActiveModal('ADMIN');
                    }
                }
                else {
                setShowModal(false); // 올바른 접근 시 모달 비활성화
                }
            }
        }
    }, [isLogin, userRole, allowedRoles, location.pathname, location.search, dispatch]);

    // 모달 닫기 및 메인 페이지로 돌아가도록
    const handleModalClose = () => {
        setShowModal(false);
        dispatch({ type: "HIDE_MODAL" });
        navigate('/'); // 메인 페이지로 리다이렉트
    };

    // 모달이 표시되면 children이 렌더링되지 않도록 처리
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