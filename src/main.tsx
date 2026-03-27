import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
// import { Store } from './context/Store.tsx'
import { Store } from './context/Store.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient=new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Store>
      <QueryClientProvider client={queryClient}>
    <App />
      </QueryClientProvider>
    </Store>
  </StrictMode>,
)
