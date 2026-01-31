import { useState, useEffect } from 'react';
import './App.css';
import api, { type HealthResponse, type HelloResponse } from './api/client';
import { useAuth } from './auth/provider';

function App() {
  const { isAuthenticated, login, logout, token, user } = useAuth();
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
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar glass-effect">
        <div className="nav-brand">
          <div className="logo"></div>
          <div className="brand-text">
            <h1>MindX Core</h1>
            <span>Week 1 Onboarding</span>
          </div>
        </div>
        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="user-profile">
              <div className="avatar">👤</div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'Authenticated User'}</span>
                <span className="user-role">Token Active</span>
              </div>
              <button onClick={logout} className="btn btn-secondary">Logout</button>
            </div>
          ) : null}
        </div>
      </nav>

      <main className="main-content">
        {!loading && !error && !isAuthenticated && (
          <div className="login-view-centered glass-effect">
            <h2>Welcome to MindX Core</h2>
            <p>Please log in with your MindX Identity Account to access deployment telemetry and cluster management tools.</p>
            <button onClick={login} className="btn btn-primary btn-large">
              <span>🔐</span> Login with MindX ID
            </button>
          </div>
        )}

        {/* Hero Section - Only show when authenticated */}
        {isAuthenticated && (
          <section className="hero-section">
            <div className="hero-content">
              <h1>Infrastructure Status</h1>
              <p>Real-time monitoring of your Azure Kubernetes Service deployment.</p>
            </div>
            <div className="connection-status">
              <span className={`status-dot ${error ? 'error' : 'active'}`}></span>
              {error ? 'System Error' : 'Systems Operational'}
            </div>
          </section>
        )}

        {loading && <div className="loading-container"><div className="spinner"></div>Loading Telemetry...</div>}

        {error && (
          <div className="alert alert-error">
            <h3>⚠️ Connection Failure</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && isAuthenticated && (
          <div className="dashboard-grid">
            {/* Auth Status Card */}
            <div className="card glass-effect auth-status-card">
              <div className="card-header">
                <h2>🔐 Security Context</h2>
              </div>
              <div className="card-body">
                <div className={`status-badge success`}>
                  Authenticated Session
                </div>
                {token && (
                  <div className="token-box">
                    <label>Session Token</label>
                    <code>{token.substring(0, 40)}...</code>
                  </div>
                )}
              </div>
            </div>

            {/* API Health Card */}
            <div className="card glass-effect">
              <div className="card-header">
                <h2>🏥 Backend Health</h2>
              </div>
              <div className="card-body center-content">
                <div className="health-indicator">
                  <span className="heartbeat">❤️</span>
                  <span className="value">{health?.status || 'Unknown'}</span>
                </div>
                <p className="latency">Latency: &lt; 50ms</p>
              </div>
            </div>

            {/* API Message Card */}
            <div className="card glass-effect">
              <div className="card-header">
                <h2>💬 API Response</h2>
              </div>
              <div className="card-body">
                <div className="message-box">
                  "{message?.message || 'No message received'}"
                </div>
                <span className="timestamp">Received just now</span>
              </div>
            </div>

            {/* System Info Card */}
            <div className="card glass-effect wide-card">
              <div className="card-header">
                <h2>☁️ Cluster Architecture</h2>
              </div>
              <div className="card-body">
                <div className="tech-stack">
                  <div className="tech-item updated">
                    <span className="label">Public IP</span>
                    <span className="value">20.197.84.14 (Dynamic)</span>
                  </div>
                  <div className="tech-item">
                    <span className="label">Ingress Controller</span>
                    <span className="value">NGINX (v1.9.4)</span>
                  </div>
                  <div className="tech-item">
                    <span className="label">Orchestrator</span>
                    <span className="value">Azure Kubernetes Service</span>
                  </div>
                  <div className="tech-item">
                    <span className="label">Registry</span>
                    <span className="value">Azure ACR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with React + Vite + TypeScript. Deployed on Azure Cloud.</p>
        <div className="version-info">
          <span className="version">v2.1.0</span>
          <span className="api-source">API: {import.meta.env.VITE_API_URL}</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
