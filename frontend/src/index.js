import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 기본 CSS 파일 (필요시 생성)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);