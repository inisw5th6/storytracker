import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'absolute',
        left: '2px',  // NovelContainer 위치와 일치
        top: '2px',   // NovelContainer 위치와 일치
        width: '396px',
        height: '769px',
        background: 'rgba(255, 255, 255, 0.9)',
        border: '4px solid #A98157',
        borderRadius: '8px',
        zIndex: 100,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: '#A98157',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '5px 10px',
          cursor: 'pointer',
        }}
      >
        닫기
      </button>
      <div className="modal-content">{children}</div>
    </div>
  );
};

export default Modal;
