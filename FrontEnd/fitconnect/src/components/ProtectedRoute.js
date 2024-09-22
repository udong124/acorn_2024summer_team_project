// src/components/ProtectedRoute.js

import { Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import { useState } from 'react';
import AdminModal from '../components/AdminModal';
import LoginModal from '../components/LoginModal';
import MemberModal from '../components/MemberModal';
import TrainerModal from '../components/TrainerModal';


const ProtectedRoute = ({ children }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const isLogin = useSelector(state=>state.userName) ? true : false;
    const userRole = useSelector(state=>state.role);
  
    const closeModal = () => setModalOpen(false);
    //자식 컴포넌트에서 allowedRoles를 가져오기
    const allowedRoles = children.type.allowedRoles || [];
    
    if (!isLogin) {
        setModalOpen(true);
        return (
          <LoginModal 
            isOpen={modalOpen} 
            onClose={() => {
              closeModal();
              return <Navigate to="/auth" />;
            }} 
          />
        );
      }
    
      
      if (!allowedRoles.includes(userRole)) {
        setModalOpen(true);
    
        const roleAccessModal = () => {
          switch (userRole) {
            case 'admin':
              return <AdminModal isOpen={modalOpen} onClose={() => {
                closeModal();
                return <Navigate to="/" />;
              }} />;
            case 'member':
              return <MemberModal isOpen={modalOpen} onClose={() => {
                closeModal();
                return <Navigate to="/" />;
              }} />;
            case 'trainer':
              return <TrainerModal isOpen={modalOpen} onClose={() => {
                closeModal();
                return <Navigate to="/" />;
              }} />;
            default:
              return <Navigate to="/" />;
          }
        };
    
        return roleAccessModal();
      }
    
      
      return children;
    };
    
export default ProtectedRoute;