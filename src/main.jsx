import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import queryClient from './queryClient.js'
import { setupErrorSuppression } from './utils/errorSuppression'
import './styles/index.css'

// Setup error suppression for sensitive endpoints before app starts
setupErrorSuppression()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
