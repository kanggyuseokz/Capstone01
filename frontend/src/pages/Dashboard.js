import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { callApi } from '../api';

// 컴포넌트 임포트
import ConfirmationModal from '../components/common/ConfirmationModal';
import UserDetailModal from '../components/modals/UserDetailModal';
import UsersTab from '../components/tabs/UsersTab';
import LogsTab from '../components/tabs/LogsTab';
import BlockedIPsTab from '../components/tabs/BlockedIPsTab';
import ApprovalTab from '../components/tabs/ApprovalTab';
import ProfileTab from '../components/tabs/ProfileTab';


const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  
  // 모든 상태 (State)
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 모달 상태
  const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '', onConfirm: null, onCancel: null });
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 프로필 수정 상태
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // 데이터 로딩 함수들
  const fetchAllData = useCallback(async () => {
    const usersRes = await callApi('http://localhost:5001/api/users');
    if (usersRes && !usersRes.error) setUsers(usersRes);

    const logsRes = await callApi('http://localhost:5001/api/admin/logs');
    if (logsRes && !logsRes.error) setLogs(logsRes);

    const ipsRes = await callApi('http://localhost:5001/api/blocked_ips');
    if (ipsRes && !ipsRes.error) setBlockedIPs(ipsRes);

    const adminsRes = await callApi('http://localhost:5001/api/admins');
    if (adminsRes && !adminsRes.error) setAdmins(adminsRes);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, activeTab]);

  // 커스텀 모달 함수
  const customAlert = (message, title = '알림') => {
    setModalInfo({ show: true, title, message, onConfirm: () => setModalInfo({ show: false }), onCancel: null });
  };
  const customConfirm = (message, onConfirm, title = '확인') => {
    setModalInfo({ show: true, title, message, onConfirm: () => { onConfirm(); setModalInfo({ show: false }); }, onCancel: () => setModalInfo({ show: false }) });
  };
  
  // 핸들러 함수들
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const result = await callApi(`http://localhost:5001/api/admins/${user.admin_id}`, 'PATCH', { currentPassword, newPassword, email: newEmail });
    if (result.success) {
      customAlert('정보가 수정되었습니다.');
      setCurrentPassword(''); setNewPassword(''); setNewEmail('');
    } else {
      customAlert(result.error || '수정 실패');
    }
  };

  const filteredLogs = logs.filter(log =>
    Object.values(log).some(val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersTab users={users} onUserSelect={(user) => { setSelectedUser(user); setShowUserDetail(true); }} />;
      case 'logs':
        return <LogsTab logs={filteredLogs} searchTerm={searchTerm} setSearchTerm={setSearchTerm} /* ... 다른 props */ />;
      case 'blocked_ips':
        return <BlockedIPsTab blockedIPs={blockedIPs} /* ... */ />;
      case 'approve':
        return <ApprovalTab admins={admins} currentAdminId={user.admin_id} /* ... */ />;
      case 'profile':
        return <ProfileTab onProfileUpdate={handleProfileUpdate} {...{currentPassword, setCurrentPassword, newPassword, setNewPassword, newEmail, setNewEmail}} />;
      default:
        return <div>탭을 선택하세요.</div>;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
        <div className="container-fluid">
          <span className="navbar-brand">🔐 보안 대시보드</span>
          <div>
            <span className="navbar-text me-3">안녕하세요, {user?.username}님</span>
            <button className="btn btn-danger" onClick={logout}>로그아웃</button>
          </div>
        </div>
      </nav>

      <div className="container-fluid flex-grow-1">
        <div className="row h-100">
          {/* Sidebar */}
          <nav className="col-md-2 d-none d-md-block bg-secondary sidebar">
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                {['users', 'logs', 'blocked_ips', 'approve', 'profile'].map(tab => (
                  <li className="nav-item" key={tab}>
                    <button className={`btn nav-link text-white ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
            {renderTabContent()}
          </main>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal {...modalInfo} />
      <UserDetailModal 
        show={showUserDetail} 
        user={selectedUser} 
        onClose={() => setShowUserDetail(false)}
        customAlert={customAlert}
        customConfirm={customConfirm}
        refreshLogs={fetchAllData}
      />
    </div>
  );
};

export default Dashboard;