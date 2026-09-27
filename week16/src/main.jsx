import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// index.htmlの <div id="root"></div> に対して、
// Appコンポーネントをレンダリング（画面に描画）する。
// React.StrictModeは開発中にバグを見つけやすくするための
// 「安全チェックモード」で、本番の見た目には影響しない。
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,  
)
