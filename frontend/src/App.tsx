import { useState, useEffect } from 'react';
import './App.css';
import api, { type HealthResponse, type HelloResponse } from './api/client';
import { useAuth } from './auth/provider';

function App() {
  const { isAuthenticated, login, logout, token } = useAuth();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [message, setMessage] = useState<HelloResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [healthData, messageData] = await Promise.all([
          api.health(),
          api.hello(),
        ]);
        setHealth(healthData);
        setMessage(messageData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 MindX Week 1 - Full Stack App</h1>
        <p>React Frontend + Node.js Backend on Azure AKS</p>
      </header>

      <main className="App-main">
        {loading && <div className="status loading">Loading...</div>}

        {/* Authentication Card */}
        <div className="card auth-card">
          <h2>🔐 Authentication (Step 5)</h2>
          {isAuthenticated ? (
            <div className="status success">
              <p>✅ <strong>Authenticated!</strong></p>
              <p className="token-preview">Token: {token?.substring(0, 20)}...</p>
              <button onClick={logout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <div className="status warning">
              <p>⚠️ <strong>Not logged in</strong></p>
              <button onClick={login} className="btn-login">Login with MindX ID</button>
            </div>
          )}
        </div>

        {error && (
          <div className="status error">
            <h2>❌ Error</h2>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="card">
              <h2>🏥 Backend Health</h2>
              <div className="status success">
                <strong>Status:</strong> {health?.status || 'Unknown'}
              </div>
            </div>

            <div className="card">
              <h2>💬 Backend Message</h2>
              <p className="message">{message?.message || 'No message'}</p>
            </div>

            <div className="card">
              <h2>📊 Architecture</h2>
              <ul className="architecture-list">
                <li>Frontend: React + TypeScript (Vite)</li>
                <li>Backend: Node.js + Express</li>
                <li>Container Registry: Azure ACR</li>
                <li>Orchestration: Azure Kubernetes Service</li>
                <li>Ingress: NGINX Ingress Controller</li>
                <li>Public IP: 20.44.193.144</li>
              </ul>
            </div>
          </>
        )}
      </main>

      <footer className="App-footer">
        <p>Deployed on Azure Cloud | Week 1 Onboarding</p>
      </footer>
    </div>
  );
}

export default App;
