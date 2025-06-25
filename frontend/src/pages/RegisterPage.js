import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { callApi } from '../api';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const result = await callApi('http://localhost:5001/api/register', 'POST', { name, username, password, email });
        if (result.success) {
            alert('관리자 등록이 완료되었습니다. 승인 후 로그인해주세요.');
            navigate('/login');
        } else {
            setError(result.error || '등록에 실패했습니다.');
        }
    };

    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-white">
        <div className="card bg-secondary p-4 shadow" style={{ width: '300px', borderRadius: '15px' }}>
          <h2 className="text-center mb-4 text-primary fw-bold">👮 관리자 등록</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <input value={name} onChange={e => setName(e.target.value)} className="form-control rounded-md bg-dark text-white border-secondary" placeholder="이름" required />
            </div>
            <div className="mb-3">
              <input value={username} onChange={e => setUsername(e.target.value)} className="form-control rounded-md bg-dark text-white border-secondary" placeholder="아이디" required />
            </div>
            <div className="mb-3">
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control rounded-md bg-dark text-white border-secondary" placeholder="비밀번호" required />
            </div>
            <div className="mb-3">
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control rounded-md bg-dark text-white border-secondary" placeholder="이메일" required />
            </div>
            {error && <p className="text-danger mt-3 text-center">{error}</p>}
            <div className="d-grid gap-2 mt-4">
                <button type="submit" className="btn btn-primary rounded-md py-2 fw-semibold">등록</button>
                <Link to="/login" className="btn btn-outline-light mt-2 rounded-md py-2 fw-semibold">
                    로그인 화면으로
                </Link>
            </div>
          </form>
        </div>
      </div>
    );
};

export default RegisterPage;