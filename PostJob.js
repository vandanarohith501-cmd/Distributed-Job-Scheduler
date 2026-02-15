import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI, skillsAPI } from '../services/api';

const PostJob = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [techStacks, setTechStacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pay_per_hour: '',
    experience_level: 'junior',
    required_skill_ids: [],
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
      maxWidth: '1000px',
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
      padding: '2.5rem',
      boxShadow: '35px 35px 70px #bebebe, -35px -35px 70px #ffffff',
      animation: 'slideIn 0.5s ease',
    },
    progressBar: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '3rem',
      position: 'relative',
    },
    progressLine: {
      position: 'absolute',
      top: '25px',
      left: '0',
      right: '0',
      height: '4px',
      backgroundColor: '#e0e0e0',
      boxShadow: 'inset 2px 2px 4px #bebebe, inset -2px -2px 4px #ffffff',
      zIndex: 1,
    },
    progressFill: {
      position: 'absolute',
      top: '25px',
      left: '0',
      height: '4px',
      backgroundColor: '#4f46e5',
      transition: 'width 0.3s ease',
      zIndex: 2,
      boxShadow: '0 0 10px rgba(79, 70, 229, 0.5)',
    },
    step: {
      position: 'relative',
      zIndex: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
    },
    stepNumber: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      fontSize: '1.2rem',
      color: '#4a4a4a',
      boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
      transition: 'all 0.3s ease',
    },
    stepNumberActive: {
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      boxShadow: '5px 5px 10px #4338ca, -5px -5px 10px #818cf8',
    },
    stepNumberCompleted: {
      backgroundColor: '#10b981',
      color: '#ffffff',
      boxShadow: '5px 5px 10px #0b8e5e, -5px -5px 10px #5fe3b1',
    },
    stepLabel: {
      color: '#4a4a4a',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
    },
    formSection: {
      backgroundColor: '#e0e0e0',
      borderRadius: '1.5rem',
      padding: '2rem',
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
    required: {
      color: '#ef4444',
      marginLeft: '0.25rem',
    },
    input: {
      width: '100%',
      padding: '1rem 1.25rem',
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
      padding: '1rem 1.25rem',
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '1rem',
      color: '#2d2d2d',
      fontSize: '1rem',
      transition: 'all 0.15s ease',
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
      outline: 'none',
      resize: 'vertical',
      minHeight: '200px',
    },
    select: {
      width: '100%',
      padding: '1rem 1.25rem',
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '1rem',
      color: '#2d2d2d',
      fontSize: '1rem',
      transition: 'all 0.15s ease',
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
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
      padding: '1rem 1.5rem',
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
      justifyContent: 'space-between',
      marginTop: '2rem',
    },
    button: {
      padding: '1rem 2rem',
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '1rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '8px 8px 16px #4338ca, -8px -8px 16px #818cf8',
      minWidth: '120px',
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
    previewCard: {
      backgroundColor: '#e0e0e0',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
    },
    previewTitle: {
      fontSize: '2rem',
      color: '#2d2d2d',
      marginBottom: '1rem',
    },
    previewMeta: {
      display: 'flex',
      gap: '2rem',
      marginBottom: '2rem',
      color: '#6b7280',
    },
    previewSection: {
      marginBottom: '1.5rem',
    },
    previewSectionTitle: {
      color: '#4f46e5',
      marginBottom: '0.5rem',
      fontSize: '1.1rem',
    },
    previewText: {
      color: '#4a4a4a',
      lineHeight: '1.6',
    },
    previewSkills: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    previewSkill: {
      padding: '0.5rem 1rem',
      backgroundColor: '#e0e0e0',
      borderRadius: '2rem',
      fontSize: '0.9rem',
      color: '#4a4a4a',
      boxShadow: '3px 3px 6px #bebebe, -3px -3px 6px #ffffff',
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
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.user_type !== 'recruiter') {
      navigate('/login');
      return;
    }
    fetchSkills();
  }, [navigate]);

  const fetchSkills = async () => {
    try {
      const [skillsRes, techStacksRes] = await Promise.all([
        skillsAPI.getSkills(),
        skillsAPI.getTechStacks(),
      ]);
      setSkills(skillsRes.data);
      setTechStacks(techStacksRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load skills. Please refresh the page.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillChange = (skillId) => {
    const updatedSkills = formData.required_skill_ids.includes(skillId)
      ? formData.required_skill_ids.filter(id => id !== skillId)
      : [...formData.required_skill_ids, skillId];
    
    setFormData({
      ...formData,
      required_skill_ids: updatedSkills,
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

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.title || !formData.description || !formData.pay_per_hour) {
        setError('Please fill in all required fields');
        return;
      }
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await jobAPI.createJob(formData);
      setSuccess('Job posted successfully!');
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (err) {
      console.error('Error posting job:', err);
      setError('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progressWidth = `${(currentStep / 4) * 100}%`;

  return (
    <div style={styles.container}>
      <style>{animations}</style>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Post a New Job</h1>
          <p style={styles.subtitle}>Find the perfect freelancer for your project</p>
        </div>

        <div style={styles.card}>
          {/* Progress Bar */}
          <div style={styles.progressBar}>
            <div style={styles.progressLine}></div>
            <div style={{...styles.progressFill, width: progressWidth}}></div>
            
            {[1, 2, 3, 4].map((step) => (
              <div key={step} style={styles.step}>
                <div style={{
                  ...styles.stepNumber,
                  ...(currentStep > step ? styles.stepNumberCompleted : {}),
                  ...(currentStep === step ? styles.stepNumberActive : {}),
                }}>
                  {currentStep > step ? '✓' : step}
                </div>
                <span style={styles.stepLabel}>
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Details'}
                  {step === 3 && 'Skills'}
                  {step === 4 && 'Preview'}
                </span>
              </div>
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
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>📋</span>
                  Basic Information
                </h3>
                
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Job Title <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="e.g., Senior React Developer"
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
                      Pay per Hour ($) <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      name="pay_per_hour"
                      value={formData.pay_per_hour}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="50.00"
                      min="0"
                      step="0.01"
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

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Experience Level <span style={styles.required}>*</span>
                  </label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    style={styles.select}
                    required
                    onFocus={(e) => {
                      e.target.style.boxShadow = 'inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff';
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff';
                    }}
                  >
                    <option value="junior">Junior (0-2 years)</option>
                    <option value="mid">Mid-level (3-5 years)</option>
                    <option value="senior">Senior (5+ years)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Job Description */}
            {currentStep === 2 && (
              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>
                  <span style={styles.sectionIcon}>📝</span>
                  Job Description
                </h3>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Description <span style={styles.required}>*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder="Describe the job requirements, responsibilities, and any other details..."
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
            )}

            {/* Step 3: Skills & Tech Stack */}
            {currentStep === 3 && (
              <>
                <div style={styles.formSection}>
                  <h3 style={styles.sectionTitle}>
                    <span style={styles.sectionIcon}>⚡</span>
                    Required Skills
                  </h3>
                  
                  <div style={styles.skillsGrid}>
                    {skills.map((skill) => (
                      <label
                        key={skill.id}
                        style={{
                          ...styles.skillItem,
                          ...(formData.required_skill_ids.includes(skill.id) ? styles.skillItemSelected : {}),
                        }}
                        onMouseEnter={(e) => {
                          if (!formData.required_skill_ids.includes(skill.id)) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!formData.required_skill_ids.includes(skill.id)) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '5px 5px 10px #bebebe, -5px -5px 10px #ffffff';
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.required_skill_ids.includes(skill.id)}
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

                <div style={styles.formSection}>
                  <h3 style={styles.sectionTitle}>
                    <span style={styles.sectionIcon}>💻</span>
                    Tech Stack
                  </h3>
                  
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
              </>
            )}

            {/* Step 4: Preview */}
            {currentStep === 4 && (
              <div style={styles.previewCard}>
                <h2 style={styles.previewTitle}>{formData.title || 'Job Title'}</h2>
                
                <div style={styles.previewMeta}>
                  <span>💰 ${formData.pay_per_hour || '0'}/hour</span>
                  <span>📊 {formData.experience_level || 'level'}</span>
                </div>

                <div style={styles.previewSection}>
                  <h4 style={styles.previewSectionTitle}>Description</h4>
                  <p style={styles.previewText}>
                    {formData.description || 'No description provided'}
                  </p>
                </div>

                {formData.required_skill_ids.length > 0 && (
                  <div style={styles.previewSection}>
                    <h4 style={styles.previewSectionTitle}>Required Skills</h4>
                    <div style={styles.previewSkills}>
                      {formData.required_skill_ids.map(id => {
                        const skill = skills.find(s => s.id === id);
                        return skill ? (
                          <span key={id} style={styles.previewSkill}>
                            {skill.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {formData.tech_stack_ids.length > 0 && (
                  <div style={styles.previewSection}>
                    <h4 style={styles.previewSectionTitle}>Tech Stack</h4>
                    <div style={styles.previewSkills}>
                      {formData.tech_stack_ids.map(id => {
                        const tech = techStacks.find(t => t.id === id);
                        return tech ? (
                          <span key={id} style={styles.previewSkill}>
                            {tech.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={styles.buttonGroup}>
              {currentStep > 1 && (
                <button
                  type="button"
                  style={{...styles.button, ...styles.buttonSecondary}}
                  onClick={handlePrevious}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '4px 4px 8px #bebebe, -4px -4px 8px #ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = '8px 8px 16px #bebebe, -8px -8px 16px #ffffff';
                  }}
                >
                  Previous
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  style={styles.button}
                  onClick={handleNext}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '4px 4px 8px #4338ca, -4px -4px 8px #818cf8';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '8px 8px 16px #4338ca, -8px -8px 16px #818cf8';
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.button,
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
                  {loading ? 'Posting...' : 'Post Job'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;