import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from "react-ga4";
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './auth/provider.tsx'

// Initialize Google Analytics
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (MEASUREMENT_ID) {
  ReactGA.initialize(MEASUREMENT_ID);
  console.log("GA Initialized with ID:", MEASUREMENT_ID);
} else {
  console.warn("GA Measurement ID not found in environment variables");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
