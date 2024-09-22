// src/components/LoginModal.js
import React from 'react';
import { Button, Modal, ModalBody } from "react-bootstrap";

const LoginModal = ({ isOpen, onClose }) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>로그인이 필요합니다</Modal.Title>
      </Modal.Header>
      <ModalBody>
        해당 페이지에 접근하려면 로그인이 필요합니다.
      </ModalBody>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
