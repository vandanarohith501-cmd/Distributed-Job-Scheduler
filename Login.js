import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: '#e0e0e0',
    },
    card: {
      width: '100%',
      maxWidth: '450px',
      backgroundColor: '#e0e0e0',
      borderRadius: '2rem',
      padding: '2.5rem',
      boxShadow: '35px 35px 70px #bebebe, -35px -35px 70px #ffffff',
      animation: 'slideIn 0.5s ease',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2rem',
      color: '#2d2d2d',
      marginBottom: '0.5rem',
    },
    subtitle: {
      color: '#4a4a4a',
      fontSize: '1rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      color: '#4a4a4a',
      fontWeight: '500',
      fontSize: '0.95rem',
      marginLeft: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '1rem',
      color: '#2d2d2d',
      fontSize: '1rem',
      transition: 'all 0.15s ease',
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
      outline: 'none',
    },
    inputFocus: {
      boxShadow: 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff',
    },
    inputError: {
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff, 0 0 0 2px rgba(239, 68, 68, 0.2)',
    },
    errorMessage: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      padding: '1rem',
      borderRadius: '1rem',
      fontSize: '0.95rem',
      marginBottom: '1rem',
      boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '1rem',
      fontSize: '1.1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '8px 8px 16px #4338ca, -8px -8px 16px #818cf8',
      marginTop: '1rem',
      position: 'relative',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '4px 4px 8px #4338ca, -4px -4px 8px #818cf8',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      boxShadow: 'inset 4px 4px 8px #4338ca, inset -4px -4px 8px #818cf8',
    },
    buttonLoading: {
      color: 'transparent',
    },
    buttonLoadingAfter: {
      content: '""',
      position: 'absolute',
      width: '20px',
      height: '20px',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      border: '2px solid #e0e0e0',
      borderTopColor: '#4f46e5',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    footer: {
      textAlign: 'center',
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: '2px solid #e0e0e0',
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    link: {
      color: '#4f46e5',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.15s ease',
    },
    demoCredentials: {
      marginTop: '1.5rem',
      padding: '1rem',
      backgroundColor: '#e0e0e0',
      borderRadius: '1rem',
      boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff',
    },
    demoText: {
      color: '#4a4a4a',
      fontSize: '0.9rem',
      marginBottom: '0.5rem',
    },
    demoSmall: {
      color: '#6b7280',
      fontSize: '0.85rem',
      display: 'block',
      marginTop: '0.25rem',
    },
  };

  // Keyframes animations
  const animations = `
    @keyframes slideIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes spin {
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
  `;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (response.data.user.user_type === 'freelancer') {
        navigate('/freelancer/profile');
      } else {
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{animations}</style>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(error ? styles.inputError : {}),
              }}
              placeholder="Enter your username"
              required
              onFocus={(e) => {
                e.target.style.boxShadow = 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff';
              }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(error ? styles.inputError : {}),
              }}
              placeholder="Enter your password"
              required
              onFocus={(e) => {
                e.target.style.boxShadow = 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonLoading : {}),
              ...(loading ? styles.buttonDisabled : {}),
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '4px 4px 8px #4338ca, -4px -4px 8px #818cf8';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '8px 8px 16px #4338ca, -8px -8px 16px #818cf8';
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={styles.demoCredentials}>
            <p style={styles.demoText}>Demo Credentials:</p>
            <p style={styles.demoText}>
              <strong>Freelancer:</strong> freelancer / password123
            </p>
            <p style={styles.demoText}>
              <strong>Recruiter:</strong> recruiter / password123
            </p>
            <small style={styles.demoSmall}>* Create these users in Django admin first</small>
          </div>
        </form>

        <div style={styles.footer}>
          <Link 
            to="/register" 
            style={styles.link}
            onMouseEnter={(e) => {
              e.target.style.color = '#4338ca';
              e.target.style.textShadow = '2px 2px 4px #bebebe, -2px -2px 4px #ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#4f46e5';
              e.target.style.textShadow = 'none';
            }}
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;