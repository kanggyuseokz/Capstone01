import React, { useState, useEffect } from 'react';
import { callApi } from '../../api';

const UserDetailModal = ({ show, user, onClose, customAlert, customConfirm, refreshLogs }) => {
  const [userLogs, setUserLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserLogs = async () => {
      if (user?.username) {
        setLoading(true);
        const result = await callApi(`http://localhost:5001/api/users/${user.username}/logs`);
        if (result && !result.error) {
          setUserLogs(result);
        }
        setLoading(false);
      }
    };

    if (show) {
      fetchUserLogs();
    }
  }, [show, user]);

  const deleteSingleLog = async (logId) => {
    customConfirm('이 로그를 삭제하시겠습니까?', async () => {
      const result = await callApi(`http://localhost:5001/api/admin/logs/${logId}`, 'DELETE');
      if (result.success) {
        customAlert('로그가 삭제되었습니다.');
        // 삭제 후 로그 목록 새로고침
        const updatedResult = await callApi(`http://localhost:5001/api/users/${user.username}/logs`);
        setUserLogs(updatedResult);
        refreshLogs(); // 전체 로그 목록도 새로고침
      } else {
        customAlert(result.error || '로그 삭제 실패');
      }
    });
  };

  if (!show || !user) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content bg-dark text-white border border-primary">
          <div className="modal-header">
            <h5 className="modal-title">고객 상세 정보: {user.username}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* 기본 정보 표시 */}
            <p><strong>이름:</strong> {user.name}</p>
            <p><strong>이메일:</strong> {user.email}</p>
            <hr />
            <h6>관련 공격 로그</h6>
            {loading ? <p>로딩 중...</p> : (
              <div className="table-responsive">
                <table className="table table-dark table-sm">
                  <thead>
                    <tr><th>시간</th><th>IP</th><th>탐지 유형</th><th>액션</th></tr>
                  </thead>
                  <tbody>
                    {userLogs.length > 0 ? userLogs.map(log => (
                      <tr key={log.id}>
                        <td>{log.timestamp}</td>
                        <td>{log.ip}</td>
                        <td>{log.detected_attack_types}</td>
                        <td><button className="btn btn-sm btn-outline-danger" onClick={() => deleteSingleLog(log.id)}>삭제</button></td>
                      </tr>
                    )) : <tr><td colSpan="4">관련 로그 없음</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;