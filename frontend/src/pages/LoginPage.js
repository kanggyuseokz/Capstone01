import React, { useState, useContext } from 'react';
// useNavigate를 import 목록에서 제거하고 Link만 남깁니다.
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  // useNavigate 훅을 사용하지 않으므로 관련 코드를 삭제합니다.
  // const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    
    // 성공했을 때 navigate()를 호출하는 부분을 삭제합니다.
    // 실패했을 때만 에러 메시지를 설정합니다.
    if (!result.success) {
      setError(result.error || '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
      <div className="card bg-secondary p-4 shadow" style={{ width: '300px', borderRadius: '15px' }}>
        <h2 className="text-center mb-4 text-primary fw-bold">🔐 보안 관리자 로그인</h2>
        <form onSubmit={handleLogin}>
          {/* ... input 필드들은 그대로 ... */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control rounded-md bg-dark text-white border-secondary"
              placeholder="아이디"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control rounded-md bg-dark text-white border-secondary"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger mt-3 text-center">{error}</p>}
          <div className="d-grid gap-2 mt-4">
            <button type="submit" className="btn btn-primary rounded-md py-2 fw-semibold">로그인</button>
            <Link to="/register" className="btn btn-outline-light mt-2 rounded-md py-2 fw-semibold">
              관리자 등록
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;