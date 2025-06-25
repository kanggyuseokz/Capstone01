import React from 'react';

const ConfirmationModal = ({ show, title, message, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-white border border-primary">
          <div className="modal-header border-bottom border-secondary">
            <h5 className="modal-title text-primary">{title}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer border-top border-secondary">
            {onCancel && <button type="button" className="btn btn-secondary" onClick={onCancel}>취소</button>}
            {onConfirm && <button type="button" className="btn btn-primary" onClick={onConfirm}>확인</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;