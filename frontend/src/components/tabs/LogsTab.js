import React from 'react';

const LogsTab = ({ logs, searchTerm, setSearchTerm, onLogSelect, onDeleteLog, onDeleteAllLogs }) => (
  <div className="card bg-secondary p-4">
    <h2>📜 공격 로그</h2>
    <input
      type="text"
      className="form-control bg-dark text-white my-3"
      placeholder="검색..."
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
    />
    <div className="table-responsive">
      <table className="table table-dark table-hover">
        <thead>
          <tr><th>시간</th><th>사용자</th><th>IP</th><th>탐지 유형</th><th>액션</th></tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} onClick={() => onLogSelect(log)} style={{cursor: 'pointer'}}>
              <td>{log.timestamp}</td>
              <td>{log.username}</td>
              <td>{log.ip}</td>
              <td>{log.detected_attack_types}</td>
              <td><button className="btn btn-sm btn-outline-danger" onClick={(e) => {e.stopPropagation(); onDeleteLog(log.id);}}>삭제</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <button className="btn btn-danger mt-3" onClick={onDeleteAllLogs}>모든 로그 삭제</button>
  </div>
);

export default LogsTab;