import React from 'react';

const ProfileTab = ({ onProfileUpdate, currentPassword, setCurrentPassword, newPassword, setNewPassword, newEmail, setNewEmail }) => (
  <div className="card bg-secondary p-4">
    <h2>⚙️ 내 정보 수정</h2>
    <form onSubmit={onProfileUpdate}>
      <div className="mb-3">
        <label className="form-label">현재 비밀번호 *</label>
        <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="form-control bg-dark text-white" required />
      </div>
      <div className="mb-3">
        <label className="form-label">새 비밀번호</label>
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="form-control bg-dark text-white" />
      </div>
      <div className="mb-3">
        <label className="form-label">새 이메일</label>
        <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="form-control bg-dark text-white" />
      </div>
      <button type="submit" className="btn btn-primary">정보 수정</button>
    </form>
  </div>
);

export default ProfileTab;