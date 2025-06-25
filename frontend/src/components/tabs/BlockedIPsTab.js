import React from 'react';

const BlockedIPsTab = ({ blockedIPs, onUnblockIp }) => (
  <div className="card bg-secondary p-4">
    <h2>🚫 차단 IP 관리</h2>
    <table className="table table-dark">
      <thead>
        <tr><th>IP 주소</th><th>차단 만료</th><th>사유</th><th>액션</th></tr>
      </thead>
      <tbody>
        {blockedIPs.map(ip => (
          <tr key={ip.id}>
            <td>{ip.ip}</td>
            <td>{ip.expires_at}</td>
            <td>{ip.reason}</td>
            <td><button className="btn btn-sm btn-success" onClick={() => onUnblockIp(ip.id)}>차단 해제</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default BlockedIPsTab;