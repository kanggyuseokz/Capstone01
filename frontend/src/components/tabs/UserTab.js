import React from 'react';

// 이 컴포넌트는 user 목록을 받아 테이블 형태로 보여주는 역할만 합니다.
const UsersTab = ({ users, onUserSelect }) => {
    return (
        <div className="card bg-secondary p-4 shadow-xl rounded-lg border border-gray-700">
            <h2 className="card-title text-white mb-4 text-2xl fw-bold">👥 고객 목록</h2>
            {users.length === 0 ? (
                <p className="text-gray-400">등록된 고객이 없습니다.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-dark table-striped table-hover rounded-lg overflow-hidden">
                        <thead>
                            <tr>
                                <th className="py-3 px-4">이름</th>
                                <th className="py-3 px-4">아이디</th>
                                <th className="py-3 px-4">이메일</th>
                                <th className="py-3 px-4">IP 주소</th>
                                <th className="py-3 px-4">마지막 로그인</th>
                                <th className="py-3 px-4">액션</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="cursor-pointer" onClick={() => onUserSelect(user)}>
                                    <td className="py-3 px-4">{user.name}</td>
                                    <td className="py-3 px-4">{user.username}</td>
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4">{user.ip}</td>
                                    <td className="py-3 px-4">{user.last_login}</td>
                                    <td className="py-3 px-4">
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUserSelect(user);
                                            }}
                                        >
                                            상세 보기
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UsersTab;