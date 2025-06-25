import React, { createContext, useState, useEffect, useCallback } from 'react';
import { callApi } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 인증 상태 확인 로딩

  const checkAuth = useCallback(async () => {
    try {
      const result = await callApi('http://localhost:5001/api/check_auth');
      if (result && result.success) {
        setIsAuthenticated(true);
        setUser({ username: result.username, admin_id: result.admin_id });
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    const result = await callApi('http://localhost:5001/api/login', 'POST', { username, password });
    if (result && result.success) {
      localStorage.setItem('isAuthenticated', 'true');
      await checkAuth(); // 로그인 성공 후 상태 다시 확인
      return result;
    }
    return result; // 실패 시 에러 메시지 포함된 결과 반환
  };

  const logout = async () => {
    await callApi('http://localhost:5001/api/logout', 'POST');
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = { isAuthenticated, user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};