import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/'); // 로그인 성공 시 대시보드로 이동
    } else {
      setError(result.error || '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
      <div className="card bg-secondary p-4 shadow" style={{ width: '300px', borderRadius: '15px' }}>
        <h2 className="text-center mb-4 text-primary fw-bold">🔐 보안 관리자 로그인</h2>
        <form onSubmit={handleLogin}>
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