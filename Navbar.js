import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  // Styles
  const styles = {
    nav: {
      backgroundColor: '#e0e0e0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '1rem 1.5rem',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#4f46e5',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
    },
    desktopMenu: {
      display: 'none',
      alignItems: 'center',
      gap: '1rem',
    },
    mobileMenu: {
      display: 'none',
    },
    navItem: {
      padding: '0.5rem 1rem',
      borderRadius: '1rem',
      color: '#4a4a4a',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      boxShadow: '3px 3px 6px #bebebe, -3px -3px 6px #ffffff',
    },
    navItemActive: {
      boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff',
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    },
    avatarText: {
      color: '#4f46e5',
      fontWeight: '600',
      fontSize: '1rem',
    },
    userName: {
      display: 'none',
      color: '#4a4a4a',
    },
    logoutBtn: {
      padding: '0.5rem 1rem',
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '1rem',
      color: '#4a4a4a',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    },
    loginBtn: {
      padding: '0.5rem 1rem',
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '1rem',
      color: '#4a4a4a',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    },
    signupBtn: {
      padding: '0.5rem 1rem',
      backgroundColor: '#4f46e5',
      border: 'none',
      borderRadius: '1rem',
      color: '#ffffff',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      boxShadow: '8px 8px 16px #4338ca, -8px -8px 16px #818cf8',
    },
    mobileBtn: {
      padding: '0.5rem',
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '1rem',
      cursor: 'pointer',
      boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    },
    mobileMenuOpen: {
      display: 'block',
      marginTop: '1rem',
      animation: 'slideIn 0.5s ease',
    },
    mobileNavItem: {
      display: 'block',
      padding: '0.75rem 1rem',
      borderRadius: '1rem',
      color: '#4a4a4a',
      textDecoration: 'none',
      textAlign: 'center',
      marginBottom: '0.5rem',
      boxShadow: '3px 3px 6px #bebebe, -3px -3px 6px #ffffff',
    },
  };

  // Keyframes animations
  const animations = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  // Media queries
  const mediaStyles = `
    @media (min-width: 768px) {
      .desktop-menu {
        display: flex !important;
      }
      .mobile-btn {
        display: none !important;
      }
      .user-name {
        display: block !important;
      }
    }
  `;

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={styles.nav}>
      <style>{animations}</style>
      <style>{mediaStyles}</style>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <Link 
            to="/" 
            style={styles.logo}
            onMouseEnter={(e) => {
              e.target.style.textShadow = '2px 2px 4px #bebebe, -2px -2px 4px #ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.textShadow = 'none';
            }}
          >
            FreelanceHub
          </Link>
          
          {/* Desktop Menu */}
          <div className="desktop-menu" style={styles.desktopMenu}>
            <Link 
              to="/jobs" 
              style={{
                ...styles.navItem,
                ...(isActive('/jobs') ? styles.navItemActive : {}),
              }}
              onMouseEnter={(e) => {
                if (!isActive('/jobs')) {
                  e.target.style.boxShadow = '2px 2px 4px #bebebe, -2px -2px 4px #ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/jobs')) {
                  e.target.style.boxShadow = '3px 3px 6px #bebebe, -3px -3px 6px #ffffff';
                }
              }}
            >
              Jobs
            </Link>
            
            {user?.user_type === 'recruiter' && (
              <>
                <Link 
                  to="/recruiter/post-job" 
                  style={{
                    ...styles.navItem,
                    ...(isActive('/recruiter/post-job') ? styles.navItemActive : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive('/recruiter/post-job')) {
                      e.target.style.boxShadow = '2px 2px 4px #bebebe, -2px -2px 4px #ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/recruiter/post-job')) {
                      e.target.style.boxShadow = '3px 3px 6px #bebebe, -3px -3px 6px #ffffff';
                    }
                  }}
                >
                  Post a Job
                </Link>
                <Link 
                  to="/recruiter/dashboard" 
                  style={{
                    ...styles.navItem,
                    ...(isActive('/recruiter/dashboard') ? styles.navItemActive : {}),
                  }}
                >
                  Dashboard
                </Link>
              </>
            )}
            
            {user?.user_type === 'freelancer' && (
              <Link 
                to="/freelancer/profile" 
                style={{
                  ...styles.navItem,
                  ...(isActive('/freelancer/profile') ? styles.navItemActive : {}),
                }}
              >
                My Profile
              </Link>
            )}
          </div>
        </div>

        <div style={styles.rightSection}>
          {user ? (
            <>
              <div style={styles.avatar}>
                <span style={styles.avatarText}>
                  {user.first_name?.charAt(0) || user.username?.charAt(0)}
                </span>
              </div>
              <span className="user-name" style={styles.userName}>
                {user.first_name || user.username}
              </span>
              <button
                onClick={handleLogout}
                style={styles.logoutBtn}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '4px 4px 8px #bebebe, -4px -4px 8px #ffffff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="desktop-menu"
                style={styles.loginBtn}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '4px 4px 8px #bebebe, -4px -4px 8px #ffffff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
                }}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                style={styles.signupBtn}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '4px 4px 8px #4338ca, -4px -4px 8px #818cf8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '8px 8px 16px #4338ca, -8px -8px 16px #818cf8';
                }}
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="mobile-btn"
            style={styles.mobileBtn}
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '4px 4px 8px #bebebe, -4px -4px 8px #ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={styles.mobileMenuOpen}>
          <Link 
            to="/jobs" 
            style={styles.mobileNavItem}
            onClick={() => setIsOpen(false)}
          >
            Jobs
          </Link>
          
          {user?.user_type === 'recruiter' && (
            <>
              <Link 
                to="/recruiter/post-job" 
                style={styles.mobileNavItem}
                onClick={() => setIsOpen(false)}
              >
                Post a Job
              </Link>
              <Link 
                to="/recruiter/dashboard" 
                style={styles.mobileNavItem}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            </>
          )}
          
          {user?.user_type === 'freelancer' && (
            <Link 
              to="/freelancer/profile" 
              style={styles.mobileNavItem}
              onClick={() => setIsOpen(false)}
            >
              My Profile
            </Link>
          )}
          
          {!user && (
            <Link 
              to="/login" 
              style={styles.mobileNavItem}
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 