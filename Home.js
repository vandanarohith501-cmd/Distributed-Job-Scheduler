// // import React from "react";
// // import { Container, Typography, Button, Box } from "@mui/material";
// // import { useNavigate } from "react-router-dom";

// // const Home = () => {
// //   const navigate = useNavigate();

// //   return (
// //     <Box
// //       sx={{
// //         minHeight: "100vh",
// //         display: "flex",
// //         alignItems: "center",
// //         justifyContent: "center",
// //         background: "linear-gradient(to right, #d219ad, #42a5f5)",
// //         color: "white",
// //         textAlign: "center",
// //       }}
// //     >
// //       <Container maxWidth="md">
// //         <Typography variant="h3" fontWeight="bold" gutterBottom>
// //           Welcome to FreelanceHub
// //         </Typography>

// //         <Typography variant="h6" sx={{ mb: 4 }}>
// //           Connect with top freelancers and recruiters.
// //           Build your career or hire the best talent.
// //         </Typography>

// //         <Button
// //           variant="contained"
// //           size="large"
// //           sx={{
// //             backgroundColor: "white",
// //             color: "#1976d2",
// //             fontWeight: "bold",
// //             px: 4,
// //             py: 1.5,
// //             borderRadius: 3,
// //             "&:hover": {
// //               backgroundColor: "#f5f5f5",
// //             },
// //           }}
// //           onClick={() => navigate("/register")}
// //         >
// //           Get Started
// //         </Button>
// //       </Container>
// //     </Box>
// //   );
// // };

// // export default Home;


// import React from "react";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const navigate = useNavigate();

//   const handleGetStarted = () => {
//     navigate("/register");
//   };

//   // Neumorphism Styles
//   const styles = {
//     container: {
//       height: "100vh",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       background: "#c615b1",
//       fontFamily: "Segoe UI, sans-serif",
//     },
//     card: {
//       padding: "50px",
//       borderRadius: "20px",
//       background: "skyblue",
//       boxShadow:
//         "9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff",
//       textAlign: "center",
//       width: "400px",
//     },
//     title: {
//       fontSize: "2.2rem",
//       fontWeight: "bold",
//       marginBottom: "15px",
//       color: "purple",
//     },
//     subtitle: {
//       fontSize: "1rem",
//       marginBottom: "10px",
//       color: "#555",
//     },
//     button: {
//       marginTop: "25px",
//       padding: "12px 30px",
//       fontSize: "1rem",
//       fontWeight: "600",
//       borderRadius: "30px",
//       border: "none",
//       cursor: "pointer",
//       background: "skyblue",
//       boxShadow:
//         "6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff",
//       transition: "all 0.2s ease",
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.card}>
//         <h1 style={styles.title}>Welcome to Freelance Hub</h1>
//         <p style={styles.subtitle}>
//           Discover, connect, and hire talented freelancers.
//         </p>
//         <p style={styles.subtitle}>
//           Build your career or hire the best talent.
//         </p>

//         <button
//           style={styles.button}
//           onClick={handleGetStarted}
//           onMouseDown={(e) =>
//             (e.target.style.boxShadow =
//               "inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff")
//           }
//           onMouseUp={(e) =>
//             (e.target.style.boxShadow =
//               "6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff")
//           }
//         >
//           Get Started
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Home;


import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      padding: '3rem 0',
      backgroundColor: '#e0e0e0',
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    heroSection: {
      textAlign: 'center',
      padding: '3rem 0',
      animation: 'fadeIn 0.5s ease',
    },
    heroTitle: {
      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
      fontWeight: '700',
      color: '#2d2d2d',
      marginBottom: '1rem',
      lineHeight: '1.2',
    },
    heroSpan: {
      color: '#4f46e5',
      display: 'inline-block',
      animation: 'float 3s ease-in-out infinite',
    },
    heroSubtitle: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      color: '#4a4a4a',
      maxWidth: '600px',
      margin: '0 auto 2rem',
      lineHeight: '1.6',
    },
    heroButtons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem',
      flexWrap: 'wrap',
    },
    btn: {
      padding: '0.75rem 2rem',
      fontSize: '1.125rem',
      border: 'none',
      borderRadius: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      minWidth: '200px',
      textAlign: 'center',
    },
    btnPrimary: {
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      boxShadow: '8px 8px 16px #4338ca, -8px -8px 16px #818cf8',
    },
    btnSecondary: {
      backgroundColor: '#e0e0e0',
      color: '#2d2d2d',
      boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
      marginBottom: '3rem',
      color: '#2d2d2d',
      position: 'relative',
    },
    sectionTitleAfter: {
      content: '""',
      position: 'absolute',
      bottom: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100px',
      height: '4px',
      backgroundColor: '#4f46e5',
      borderRadius: '9999px',
      boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginTop: '2rem',
    },
    featureCard: {
      backgroundColor: '#e0e0e0',
      borderRadius: '2rem',
      padding: '2rem',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
      animation: 'slideIn 0.5s ease',
    },
    featureCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '25px 25px 75px #bebebe, -25px -25px 75px #ffffff',
    },
    featureIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      display: 'inline-block',
      padding: '1rem',
      backgroundColor: '#e0e0e0',
      borderRadius: '50%',
      boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    },
    featureTitle: {
      fontSize: '1.5rem',
      marginBottom: '1rem',
      color: '#2d2d2d',
    },
    featureDescription: {
      color: '#4a4a4a',
      lineHeight: '1.6',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginTop: '3rem',
    },
    statCard: {
      backgroundColor: '#e0e0e0',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      textAlign: 'center',
      boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
      transition: 'all 0.3s ease',
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#4f46e5',
      marginBottom: '0.5rem',
    },
    statLabel: {
      color: '#4a4a4a',
      fontSize: '1rem',
    },
    ctaCard: {
      backgroundColor: '#e0e0e0',
      borderRadius: '2rem',
      padding: '3rem',
      textAlign: 'center',
      boxShadow: '35px 35px 70px #bebebe, -35px -35px 70px #ffffff',
      marginTop: '3rem',
    },
    ctaTitle: {
      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
      marginBottom: '1rem',
      color: '#2d2d2d',
    },
    ctaText: {
      color: '#4a4a4a',
      fontSize: '1.125rem',
      marginBottom: '2rem',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    ctaBtn: {
      padding: '1rem 3rem',
      fontSize: '1.25rem',
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      boxShadow: '8px 8px 16px #4338ca, -8px -8px 16px #818cf8',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
    },
  };

  // Keyframes animations as string
  const animations = `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
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
  `;

  return (
    <div style={styles.container}>
      <style>{animations}</style>
      <div style={styles.wrapper}>
        
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <h1 style={styles.heroTitle}>
            Welcome to <span style={styles.heroSpan}>FreelanceHub</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Connect with top freelancers and find the perfect match for your projects.
            Experience the future of freelance work.
          </p>
          
          <div style={styles.heroButtons}>
            {!user ? (
              <>
                <Link 
                  to="/register" 
                  style={{...styles.btn, ...styles.btnPrimary}}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '4px 4px 8px #4338ca, -4px -4px 8px #818cf8';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '8px 8px 16px #4338ca, -8px -8px 16px #818cf8';
                  }}
                >
                  Get Started
                </Link>
                <Link 
                  to="/login" 
                  style={{...styles.btn, ...styles.btnSecondary}}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '4px 4px 8px #bebebe, -4px -4px 8px #ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
                  }}
                >
                  Sign In
                </Link>
              </>
            ) : (
              <Link 
                to="/jobs" 
                style={{...styles.btn, ...styles.btnPrimary}}
              >
                Browse Jobs
              </Link>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div style={{ padding: '3rem 0' }}>
          <h2 style={styles.sectionTitle}>
            Why Choose FreelanceHub?
            <div style={styles.sectionTitleAfter}></div>
          </h2>
          
          <div style={styles.featuresGrid}>
            {[
              {
                icon: '💼',
                title: 'Find Jobs',
                description: 'Browse through hundreds of job opportunities tailored to your skills and experience.'
              },
              {
                icon: '🤝',
                title: 'Hire Talent',
                description: 'Post jobs and find the best freelancers for your projects with ease.'
              },
              {
                icon: '🔒',
                title: 'Secure Payments',
                description: 'Safe and secure payment processing for all your transactions.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                style={styles.featureCard}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.featureCardHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '20px 20px 60px #bebebe, -20px -20px 60px #ffffff';
                }}
              >
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ padding: '3rem 0' }}>
          <div style={styles.statsGrid}>
            {[
              { number: '10K+', label: 'Freelancers' },
              { number: '5K+', label: 'Jobs Posted' },
              { number: '95%', label: 'Success Rate' },
              { number: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div 
                key={index}
                style={styles.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={styles.statNumber}>{stat.number}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ padding: '3rem 0' }}>
          <div style={styles.ctaCard}>
            <h2 style={styles.ctaTitle}>Ready to Start Your Journey?</h2>
            <p style={styles.ctaText}>
              Join thousands of freelancers and recruiters who trust FreelanceHub
            </p>
            {!user && (
              <Link 
                to="/register" 
                style={styles.ctaBtn}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '4px 4px 8px #4338ca, -4px -4px 8px #818cf8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '8px 8px 16px #4338ca, -8px -8px 16px #818cf8';
                }}
              >
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;