import React, { useState, useEffect } from 'react';
import { callApi } from '../api';
// ... 컴포넌트 임포트 ...
import UsersTab from '../components/tabs/UsersTab';
// ... 다른 탭 컴포넌트 ...

const Dashboard = () => {
    // ui.js의 모든 상태(useState)들을 여기로 옮깁니다.
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    // ... 기타 상태들 ...

    // ui.js의 데이터 fetching 함수 (fetchUsers, fetchLogs 등)를 여기로 옮깁니다.
    const fetchUsers = async () => { /* ... */ };
    const fetchLogs = async () => { /* ... */ };

    useEffect(() => {
        // 처음 로드될 때 필요한 데이터들을 가져옵니다.
        fetchUsers();
        fetchLogs();
    }, []);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'users':
                return <UsersTab users={users} /* ... */ />;
            // case 'logs':
            //     return <LogsTab logs={logs} /* ... */ />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-dark text-white">
            {/* Navbar */}
            {/* Sidebar (setActiveTab을 props로 전달) */}
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-3">
                {renderTabContent()}
            </main>
            {/* Modal 컴포넌트들 (상태에 따라 보이도록) */}
        </div>
    );
};

export default Dashboard;
