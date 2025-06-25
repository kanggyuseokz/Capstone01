import React, { createContext, useState, useEffect, useCallback } from 'react';
import { callApi } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 인증 상태 확인 로딩

  // useCallback을 사용하여 checkAuth 함수가 불필요하게 재생성되는 것을 방지합니다.
  const checkAuth = useCallback(async () => {
    try {
      // 로컬 스토리지에 인증 정보가 없으면 API 호출을 건너뜁니다.
      const storedAuth = localStorage.getItem('isAuthenticated');
      if (storedAuth !== 'true') {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      
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
      localStorage.removeItem('isAuthenticated');
    } finally {
      // finally 블록에서 항상 로딩 상태를 false로 변경합니다.
      setLoading(false);
    }
  }, []); // 의존성 배열이 비어있으므로, 컴포넌트가 처음 마운트될 때 한 번만 생성됩니다.

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username, password) => {
    const result = await callApi('http://localhost:5001/api/login', 'POST', { username, password });
    if (result && result.success) {
      localStorage.setItem('isAuthenticated', 'true');
      await checkAuth(); // 로그인 성공 후 인증 상태 다시 확인
      return result;
    }
    return result;
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