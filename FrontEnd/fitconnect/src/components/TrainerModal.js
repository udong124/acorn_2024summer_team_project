// src/components/TrainerModal.js
import React from 'react';
import {Button, Modal, ModalBody} from "react-bootstrap";


const TrainerModal = ({ isOpen, onClose }) => {
    return (
        <Modal show={isOpen} onHide={onClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>트레이너 전용 페이지</Modal.Title>
          </Modal.Header>
          <ModalBody>
            해당 페이지는 트레이너만 접근가능합니다.
          </ModalBody>
          <Modal.Footer>
            <Button variant="primary" onClick={onClose}>
              확인
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };

export default TrainerModal;
