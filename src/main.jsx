import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { applyTheme, getStoredTheme } from '@/hooks/useTheme'

applyTheme(getStoredTheme())

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)