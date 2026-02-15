import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI, skillsAPI } from '../services/api';

const FreelancerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [skills, setSkills] = useState([]);
  const [techStacks, setTechStacks] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    education: '',
    experience: '',
    bio: '',
    hourly_rate: '',
    skill_ids: [],
    tech_stack_ids: [],
  });

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      padding: '2rem 1rem',
      backgroundColor: '#e0e0e0',
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '2rem',
      textAlign: 'center',
    },
    title: {
      fontSize: '2.5rem',
      color: '#2d2d2d',
      marginBottom: '0.5rem',
      fontWeight: '600',
    },
    subtitle: {
      color: '#4a4a4a',
      fontSize: '1.1rem',
    },
    card: {
      backgroundColor: '#e0e0e0',
      borderRadius: '2rem',
      padding: '2rem',
      boxShadow: '35px 35px 70px #bebebe, -35px -35px 70px #ffffff',
      animation: 'slideIn 0.5s ease',
    },
    tabs: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      borderBottom: '2px solid #e0e0e0',
      paddingBottom: '1rem',
      flexWrap: 'wrap',
    },
    tab: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '1rem',
      color: '#4a4a4a',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
    },
    tabActive: {
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
      color: '#4f46e5',
    },
    profileHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      marginBottom: '2rem',
      padding: '1.5rem',
      backgroundColor: '#e0e0e0',
      borderRadius: '1.5rem',
      boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff',
      flexWrap: 'wrap',
    },
    avatar: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      backgroundColor: '#e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '20px 20px 40px #bebebe, -20px -20px 40px #ffffff',
      position: 'relative',
    },
    avatarPlaceholder: {
      fontSize: '3rem',
      color: '#4f46e5',
    },
    avatarUpload: {
      position: 'absolute',
      bottom: '5px',
      right: '5px',
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      backgroundColor: '#4f46e5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '5px 5px 10px #4338ca, -5px -5px 10px #818cf8',
      transition: 'all 0.3s ease',
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: '2rem',
      color: '#2d2d2d',
      marginBottom: '0.5rem',
    },
    profileEmail: {
      color: '#4a4a4a',
      fontSize: '1rem',
      marginBottom: '1rem',
    },
    profileBadges: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    badge: {
      padding: '0.5rem 1rem',
      backgroundColor: '#e0e0e0',
      borderRadius: '2rem',
      fontSize: '0.9rem',
      color: '#4a4a4a',
      boxShadow: '3px 3px 6px #bebebe, -3px -3px 6px #ffffff',
    },
    badgePrimary: {
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      boxShadow: '3px 3px 6px #4338ca, -3px -3px 6px #818cf8',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
    formSection: {
      backgroundColor: '#e0e0e0',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      color: '#2d2d2d',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    sectionIcon: {
      color: '#4f46e5',
      fontSize: '1.5rem',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
    textarea: {
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
      resize: 'vertical',
      minHeight: '100px',
    },
    skillsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '1rem',
      marginTop: '1rem',
    },
    skillItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      backgroundColor: '#e0e0e0',
      borderRadius: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
    },
    skillItemSelected: {
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
      border: '2px solid #4f46e5',
    },
    skillCheckbox: {
      display: 'none',
    },
    skillName: {
      color: '#4a4a4a',
      fontSize: '0.95rem',
    },
    techStackGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '1rem',
      marginTop: '1rem',
    },
    techItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      backgroundColor: '#e0e0e0',
      borderRadius: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
    },
    techItemSelected: {
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
      border: '2px solid #4f46e5',
    },
    techCheckbox: {
      display: 'none',
    },
    techName: {
      color: '#4a4a4a',
      fontSize: '0.95rem',
    },
    alert: {
      padding: '1rem',
      borderRadius: '1rem',
      marginBottom: '1.5rem',
      fontSize: '0.95rem',
      boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff',
    },
    alertSuccess: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
    },
    alertError: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '2rem',
      flexWrap: 'wrap',
    },
    button: {
      padding: '0.75rem 2rem',
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '1rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '8px 8px 16px #4338ca, -8px -8px 16px #818cf8',
    },
    buttonSecondary: {
      backgroundColor: '#e0e0e0',
      color: '#4a4a4a',
      boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      boxShadow: 'inset 4px 4px 8px #4338ca, inset -4px -4px 8px #818cf8',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '4px solid #e0e0e0',
      borderTopColor: '#4f46e5',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      backgroundColor: '#e0e0e0',
      borderRadius: '2rem',
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
    },
    emptyStateIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
    },
    emptyStateTitle: {
      fontSize: '1.5rem',
      color: '#2d2d2d',
      marginBottom: '1rem',
    },
    emptyStateText: {
      color: '#4a4a4a',
      marginBottom: '2rem',
    },
  };

  // Keyframes animations
  const animations = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.user_type !== 'freelancer') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [profileRes, skillsRes, techStacksRes] = await Promise.all([
        profileAPI.getProfile(),
        skillsAPI.getSkills(),
        skillsAPI.getTechStacks(),
      ]);

      if (profileRes.data.length > 0) {
        const userProfile = profileRes.data[0];
        setProfile(userProfile);
        setFormData({
          education: userProfile.education || '',
          experience: userProfile.experience || '',
          bio: userProfile.bio || '',
          hourly_rate: userProfile.hourly_rate || '',
          skill_ids: userProfile.skills.map(s => s.id),
          tech_stack_ids: userProfile.tech_stack.map(t => t.id),
        });
      }
      setSkills(skillsRes.data);
      setTechStacks(techStacksRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillChange = (skillId) => {
    const updatedSkills = formData.skill_ids.includes(skillId)
      ? formData.skill_ids.filter(id => id !== skillId)
      : [...formData.skill_ids, skillId];
    
    setFormData({
      ...formData,
      skill_ids: updatedSkills,
    });
  };

  const handleTechStackChange = (techId) => {
    const updatedTech = formData.tech_stack_ids.includes(techId)
      ? formData.tech_stack_ids.filter(id => id !== techId)
      : [...formData.tech_stack_ids, techId];
    
    setFormData({
      ...formData,
      tech_stack_ids: updatedTech,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (profile) {
        await profileAPI.updateProfile(profile.id, formData);
        setSuccess('Profile updated successfully!');
      } else {
        await profileAPI.createProfile(formData);
        setSuccess('Profile created successfully!');
        setTimeout(() => navigate('/jobs'), 2000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <style>{animations}</style>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
        </div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={styles.container}>
      <style>{animations}</style>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Freelancer Profile</h1>
          <p style={styles.subtitle}>Showcase your skills and experience to potential clients</p>
        </div>

        <div style={styles.card}>
          {/* Profile Header */}
          <div style={styles.profileHeader}>
            <div style={styles.avatar}>
              <span style={styles.avatarPlaceholder}>
                {user?.first_name?.charAt(0) || user?.username?.charAt(0)}
              </span>
              <div 
                style={styles.avatarUpload}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span style={{ color: 'white', fontSize: '1.2rem' }}>📷</span>
              </div>
            </div>
            <div style={styles.profileInfo}>
              <h2 style={styles.profileName}>
                {user?.first_name} {user?.last_name}
              </h2>
              <p style={styles.profileEmail}>{user?.email}</p>
              <div style={styles.profileBadges}>
                <span style={{...styles.badge, ...styles.badgePrimary}}>
                  Freelancer
                </span>
                {profile && (
                  <span style={styles.badge}>
                    ${formData.hourly_rate || '0'}/hr
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            {['basic', 'skills', 'tech', 'preview'].map((tab) => (
              <button
                key={tab}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab ? styles.tabActive : {}),
                }}
                onClick={() => setActiveTab(tab)}
                onMouseEnter={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.boxShadow = '3px 3px 6px #bebebe, -3px -3px 6px #ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab) {
                    e.currentTarget.style.boxShadow = '5px 5px 10px #bebebe, -5px -5px 10px #ffffff';
                  }
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {error && (
            <div style={{...styles.alert, ...styles.alertError}}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{...styles.alert, ...styles.alertSuccess}}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>📋</span>
                  Basic Information
                </h3>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Education</label>
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      style={styles.textarea}
                      placeholder="e.g., B.Tech Computer Science, XYZ University (2020-2024)"
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
                    <label style={styles.label}>Experience</label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      style={styles.textarea}
                      placeholder="Describe your work experience..."
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
                    <label style={styles.label}>Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      style={styles.textarea}
                      placeholder="Tell us about yourself..."
                      rows="4"
                      onFocus={(e) => {
                        e.target.style.boxShadow = 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff';
                      }}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Hourly Rate ($)</label>
                    <input
                      type="number"
                      name="hourly_rate"
                      value={formData.hourly_rate}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="50.00"
                      min="0"
                      step="0.01"
                      onFocus={(e) => {
                        e.target.style.boxShadow = 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff';
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>⚡</span>
                  Skills
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Select your skills (click to select multiple)
                </p>
                <div style={styles.skillsGrid}>
                  {skills.map((skill) => (
                    <label
                      key={skill.id}
                      style={{
                        ...styles.skillItem,
                        ...(formData.skill_ids.includes(skill.id) ? styles.skillItemSelected : {}),
                      }}
                      onMouseEnter={(e) => {
                        if (!formData.skill_ids.includes(skill.id)) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!formData.skill_ids.includes(skill.id)) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '5px 5px 10px #bebebe, -5px -5px 10px #ffffff';
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        className="skill-checkbox"
                        checked={formData.skill_ids.includes(skill.id)}
                        onChange={() => handleSkillChange(skill.id)}
                        style={styles.skillCheckbox}
                      />
                      <span style={styles.skillName}>{skill.name}</span>
                    </label>
                  ))}
                </div>
                {skills.length === 0 && (
                  <p style={{ color: '#9ca3af', textAlign: 'center' }}>
                    No skills available. Add skills in admin panel.
                  </p>
                )}
              </div>
            )}

            {/* Tech Stack Tab */}
            {activeTab === 'tech' && (
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>💻</span>
                  Tech Stack
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Select your tech stack (click to select multiple)
                </p>
                <div style={styles.techStackGrid}>
                  {techStacks.map((tech) => (
                    <label
                      key={tech.id}
                      style={{
                        ...styles.techItem,
                        ...(formData.tech_stack_ids.includes(tech.id) ? styles.techItemSelected : {}),
                      }}
                      onMouseEnter={(e) => {
                        if (!formData.tech_stack_ids.includes(tech.id)) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!formData.tech_stack_ids.includes(tech.id)) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '5px 5px 10px #bebebe, -5px -5px 10px #ffffff';
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        className="tech-checkbox"
                        checked={formData.tech_stack_ids.includes(tech.id)}
                        onChange={() => handleTechStackChange(tech.id)}
                        style={styles.techCheckbox}
                      />
                      <span style={styles.techName}>{tech.name}</span>
                    </label>
                  ))}
                </div>
                {techStacks.length === 0 && (
                  <p style={{ color: '#9ca3af', textAlign: 'center' }}>
                    No tech stacks available. Add tech stacks in admin panel.
                  </p>
                )}
              </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && (
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>👁️</span>
                  Profile Preview
                </h3>
                
                {!profile && !formData.education && !formData.experience ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyStateIcon}>📝</div>
                    <h3 style={styles.emptyStateTitle}>No Profile Data Yet</h3>
                    <p style={styles.emptyStateText}>
                      Fill in your information in the other tabs to see a preview
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <h4 style={{ color: '#4f46e5', marginBottom: '0.5rem' }}>Education</h4>
                      <p style={{ color: '#4a4a4a' }}>{formData.education || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <h4 style={{ color: '#4f46e5', marginBottom: '0.5rem' }}>Experience</h4>
                      <p style={{ color: '#4a4a4a' }}>{formData.experience || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <h4 style={{ color: '#4f46e5', marginBottom: '0.5rem' }}>Bio</h4>
                      <p style={{ color: '#4a4a4a' }}>{formData.bio || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <h4 style={{ color: '#4f46e5', marginBottom: '0.5rem' }}>Hourly Rate</h4>
                      <p style={{ color: '#4a4a4a' }}>${formData.hourly_rate || '0'}/hour</p>
                    </div>
                    
                    <div>
                      <h4 style={{ color: '#4f46e5', marginBottom: '0.5rem' }}>Skills</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {formData.skill_ids.map(id => {
                          const skill = skills.find(s => s.id === id);
                          return skill ? (
                            <span key={id} style={styles.badge}>
                              {skill.name}
                            </span>
                          ) : null;
                        })}
                        {formData.skill_ids.length === 0 && (
                          <span style={{ color: '#9ca3af' }}>No skills selected</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 style={{ color: '#4f46e5', marginBottom: '0.5rem' }}>Tech Stack</h4>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {formData.tech_stack_ids.map(id => {
                          const tech = techStacks.find(t => t.id === id);
                          return tech ? (
                            <span key={id} style={styles.badge}>
                              {tech.name}
                            </span>
                          ) : null;
                        })}
                        {formData.tech_stack_ids.length === 0 && (
                          <span style={{ color: '#9ca3af' }}>No tech stack selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Form Buttons */}
            <div style={styles.buttonGroup}>
              <button
                type="button"
                style={{...styles.button, ...styles.buttonSecondary}}
                onClick={() => navigate('/jobs')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '4px 4px 8px #bebebe, -4px -4px 8px #ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  ...styles.button,
                  ...(saving ? styles.buttonDisabled : {}),
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '4px 4px 8px #4338ca, -4px -4px 8px #818cf8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '8px 8px 16px #4338ca, -8px -8px 16px #818cf8';
                  }
                }}
              >
                {saving ? 'Saving...' : profile ? 'Update Profile' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;