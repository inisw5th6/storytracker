import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';  // 스타일 시트 임포트
import App from './App';

// React 애플리케이션을 root 요소에 렌더링
const container = document.getElementById('root'); // HTML에서 id='root' 요소 선택
const root = createRoot(container); // createRoot로 React 18 방식의 루트 생성

// React.StrictMode로 감싸서 렌더링
root.render(
  <React.StrictMode>
    <App />  {/* App 컴포넌트를 렌더링 */}
  </React.StrictMode>
);
