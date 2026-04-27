import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          height: '100vh', width: '100%', 
          display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center',
          background: '#000', color: '#fff',
          textAlign: 'center', padding: 40
        }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>🛸</div>
          <h2 style={{ fontSize: 32, marginBottom: 12, fontWeight: 800 }}>Signal Lost.</h2>
          <p style={{ color: '#888', marginBottom: 24, maxWidth: 400, lineHeight: 1.6 }}>
            An unexpected error interrupted your journey. Our explorers are working on it.
          </p>
          {this.state.error && (
            <pre style={{ 
              color: '#FF453A',
              background: 'rgba(255, 69, 58, 0.1)',
              padding: 20, borderRadius: 16, fontSize: 12, 
              maxWidth: '80vw', overflow: 'auto', marginBottom: 32,
              fontFamily: 'monospace', border: '1px solid rgba(255, 69, 58, 0.2)'
            }}>
              {this.state.error.toString()}
            </pre>
          )}
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              background: '#fff', color: '#000', 
              padding: '14px 32px', borderRadius: 30, 
              fontWeight: 700, border: 'none', cursor: 'pointer'
            }}
          >
            Reset Signal
          </button>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
