import React from 'react';

const ApprovalTab = ({ admins, currentAdminId, onApprove, onDeleteAdmin }) => (
  <div className="card bg-secondary p-4">
    <h2>📋 관리자 승인/관리</h2>
    {admins.map(admin => (
      <div key={admin.id} className="list-group-item bg-dark text-white mb-2 p-3">
        <h5>{admin.username} ({admin.name})</h5>
        <p>{admin.email}</p>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={admin.isApproved}
            onChange={e => onApprove(admin.id, e.target.checked)}
          />
          <label className="form-check-label">{admin.isApproved ? '승인됨' : '미승인'}</label>
        </div>
        {currentAdminId !== admin.id && (
          <button className="btn btn-sm btn-danger mt-2" onClick={() => onDeleteAdmin(admin.id)}>삭제</button>
        )}
      </div>
    ))}
  </div>
);

export default ApprovalTab;