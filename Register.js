import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    user_type: 'freelancer',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      backgroundColor: '#e0e0e0',
    },
    card: {
      width: '100%',
      maxWidth: '800px',
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
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
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
    required: {
      color: '#ef4444',
      marginLeft: '0.25rem',
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
    userTypeContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
      marginTop: '0.5rem',
    },
    userTypeCard: {
      backgroundColor: '#e0e0e0',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    },
    userTypeCardSelected: {
      boxShadow: 'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff',
      border: '2px solid #4f46e5',
    },
    userTypeIcon: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
    },
    userTypeTitle: {
      fontSize: '1.25rem',
      color: '#2d2d2d',
      marginBottom: '0.25rem',
    },
    userTypeDescription: {
      color: '#4a4a4a',
      fontSize: '0.9rem',
    },
    passwordStrength: {
      marginTop: '0.5rem',
      display: 'flex',
      gap: '0.25rem',
    },
    strengthBar: {
      height: '4px',
      flex: 1,
      backgroundColor: '#e0e0e0',
      borderRadius: '9999px',
      boxShadow: 'inset 2px 2px 4px #bebebe, inset -2px -2px 4px #ffffff',
      transition: 'all 0.3s ease',
    },
    strengthBarWeak: {
      backgroundColor: '#ef4444',
      boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
    },
    strengthBarMedium: {
      backgroundColor: '#f59e0b',
      boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
    },
    strengthBarStrong: {
      backgroundColor: '#10b981',
      boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
    },
    strengthText: {
      fontSize: '0.85rem',
      color: '#6b7280',
      marginTop: '0.25rem',
    },
    termsGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      backgroundColor: '#e0e0e0',
      borderRadius: '1rem',
      boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff',
    },
    termsCheckbox: {
      width: '20px',
      height: '20px',
      cursor: 'pointer',
      accentColor: '#4f46e5',
    },
    termsLabel: {
      color: '#4a4a4a',
      fontSize: '0.95rem',
    },
    termsLink: {
      color: '#4f46e5',
      textDecoration: 'none',
      fontWeight: '500',
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
    buttonLoading: {
      color: 'transparent',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      boxShadow: 'inset 4px 4px 8px #4338ca, inset -4px -4px 8px #818cf8',
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
      to { transform: rotate(360deg); }
    }
  `;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      // Calculate password strength
      let strength = 0;
      if (value.length >= 8) strength++;
      if (value.match(/[a-z]/)) strength++;
      if (value.match(/[A-Z]/)) strength++;
      if (value.match(/[0-9]/)) strength++;
      if (value.match(/[^a-zA-Z0-9]/)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authAPI.register(formData);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      const errorData = err.response?.data;
      let errorMessage = 'Registration failed. Please try again.';
      
      if (errorData) {
        if (typeof errorData === 'object') {
          errorMessage = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        } else {
          errorMessage = errorData;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (index) => {
    if (passwordStrength > index) {
      if (passwordStrength <= 2) return styles.strengthBarWeak;
      if (passwordStrength <= 4) return styles.strengthBarMedium;
      return styles.strengthBarStrong;
    }
    return {};
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div style={styles.container}>
      <style>{animations}</style>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join our community today</p>
        </div>

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                style={styles.input}
                placeholder="John"
                onFocus={(e) => {
                  e.target.style.boxShadow = 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff';
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Doe"
                onFocus={(e) => {
                  e.target.style.boxShadow = 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff';
                }}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Username <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={styles.input}
                placeholder="johndoe"
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
              <label style={styles.label}>
                Email <span style={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="john@example.com"
                required
                onFocus={(e) => {
                  e.target.style.boxShadow = 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff';
                }}
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Password <span style={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="••••••••"
                required
                onFocus={(e) => {
                  e.target.style.boxShadow = 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff';
                }}
              />
              {formData.password && (
                <>
                  <div style={styles.passwordStrength}>
                    {[0, 1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        style={{
                          ...styles.strengthBar,
                          ...getStrengthColor(index),
                        }}
                      />
                    ))}
                  </div>
                  <div style={styles.strengthText}>
                    Password strength: <strong>{getStrengthText()}</strong>
                  </div>
                </>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Confirm Password <span style={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                style={styles.input}
                placeholder="••••••••"
                required
                onFocus={(e) => {
                  e.target.style.boxShadow = 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff';
                }}
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>
              Account Type <span style={styles.required}>*</span>
            </label>
            <div style={styles.userTypeContainer}>
              {[
                { type: 'freelancer', icon: '💼', title: 'Freelancer', desc: 'Find work and get hired' },
                { type: 'recruiter', icon: '🏢', title: 'Recruiter', desc: 'Post jobs and hire talent' }
              ].map((option) => (
                <label
                  key={option.type}
                  style={{
                    ...styles.userTypeCard,
                    ...(formData.user_type === option.type ? styles.userTypeCardSelected : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (formData.user_type !== option.type) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '12px 12px 24px #bebebe, -12px -12px 24px #ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.user_type !== option.type) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="user_type"
                    value={option.type}
                    checked={formData.user_type === option.type}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  <div style={styles.userTypeIcon}>{option.icon}</div>
                  <div style={styles.userTypeTitle}>{option.title}</div>
                  <div style={styles.userTypeDescription}>{option.desc}</div>
                </label>
              ))}
            </div>
          </div>

          <div style={styles.termsGroup}>
            <input
              type="checkbox"
              id="terms"
              style={styles.termsCheckbox}
              required
            />
            <label htmlFor="terms" style={styles.termsLabel}>
              I agree to the{' '}
              <a href="/terms" style={styles.termsLink}>Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" style={styles.termsLink}>Privacy Policy</a>
            </label>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={styles.footer}>
          <Link 
            to="/login" 
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
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;