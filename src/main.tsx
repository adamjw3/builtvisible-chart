import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.scss'
import App from './App.tsx'

createRoot(document.getElementById('sti-chart')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
