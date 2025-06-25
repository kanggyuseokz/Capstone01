import React, { useContext } from 'react';
// Navigate 컴포넌트를 추가로 import 합니다.
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

// App 컴포넌트 내부에 새로운 컴포넌트를 만들어 라우팅 로직을 분리합니다.
const AppRoutes = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // AuthContext가 로그인 상태를 확인하는 동안 로딩 화면을 보여줍니다.
  if (loading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white"><h2>Loading...</h2></div>;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} 
      />
      <Route 
        path="/*" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;