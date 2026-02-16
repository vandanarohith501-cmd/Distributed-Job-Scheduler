import React, { useState, useEffect } from 'react';
import { jobAPI, applicationAPI } from '../services/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [skills, setSkills] = useState([]);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    description: '',
    pay_per_hour: '',
    experience_level: 'junior',
    required_skill_ids: [],
    tech_stack_ids: [],
  });
  
  const user = JSON.parse(localStorage.getItem('user'));

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
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    headerLeft: {
      flex: 1,
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
    postJobBtn: {
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
      textDecoration: 'none',
      display: 'inline-block',
    },
    filters: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    searchBox: {
      flex: 1,
      minWidth: '300px',
      position: 'relative',
    },
    searchInput: {
      width: '100%',
      padding: '1rem 1rem 1rem 3rem',
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '1.5rem',
      color: '#2d2d2d',
      fontSize: '1rem',
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
      outline: 'none',
    },
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#6b7280',
      fontSize: '1.2rem',
    },
    filterButtons: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },
    filterButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '2rem',
      color: '#4a4a4a',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
    },
    filterButtonActive: {
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
      color: '#4f46e5',
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      backgroundColor: '#e0e0e0',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      textAlign: 'center',
      boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#4f46e5',
      marginBottom: '0.5rem',
    },
    statLabel: {
      color: '#4a4a4a',
      fontSize: '0.95rem',
    },
    jobsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
    },
    jobCard: {
      backgroundColor: '#e0e0e0',
      borderRadius: '2rem',
      padding: '2rem',
      boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
      transition: 'all 0.3s ease',
    },
    jobHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    jobTitle: {
      fontSize: '1.5rem',
      color: '#2d2d2d',
      marginBottom: '0.5rem',
    },
    jobMeta: {
      display: 'flex',
      gap: '1rem',
      color: '#6b7280',
      fontSize: '0.95rem',
      flexWrap: 'wrap',
    },
    jobMetaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    jobDescription: {
      color: '#4a4a4a',
      marginBottom: '1.5rem',
      lineHeight: '1.6',
    },
    skillsContainer: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      marginBottom: '1.5rem',
    },
    skill: {
      padding: '0.5rem 1rem',
      backgroundColor: '#e0e0e0',
      borderRadius: '2rem',
      fontSize: '0.9rem',
      color: '#4a4a4a',
      boxShadow: '3px 3px 6px #bebebe, -3px -3px 6px #ffffff',
    },
    techStack: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      marginBottom: '1.5rem',
    },
    tech: {
      padding: '0.5rem 1rem',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      borderRadius: '2rem',
      fontSize: '0.9rem',
      color: '#4f46e5',
    },
    jobFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      marginTop: '1.5rem',
      paddingTop: '1.5rem',
      borderTop: '2px solid #e0e0e0',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
    },
    payRate: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#4f46e5',
    },
    payPeriod: {
      fontSize: '0.9rem',
      color: '#6b7280',
      marginLeft: '0.5rem',
    },
    actionButtons: {
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
    },
    applyButton: {
      padding: '0.75rem 2rem',
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '2rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '8px 8px 16px #4338ca, -8px -8px 16px #818cf8',
    },
    appliedButton: {
      padding: '0.75rem 2rem',
      backgroundColor: '#10b981',
      color: '#ffffff',
      border: 'none',
      borderRadius: '2rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'default',
      boxShadow: 'inset 5px 5px 10px #0b8e5e, inset -5px -5px 10px #5fe3b1',
    },
    editButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#f59e0b',
      color: '#ffffff',
      border: 'none',
      borderRadius: '2rem',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '5px 5px 10px #d97706, -5px -5px 10px #fbbf24',
    },
    deleteButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: 'none',
      borderRadius: '2rem',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '5px 5px 10px #b91c1c, -5px -5px 10px #f87171',
    },
    viewApplicationsButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      border: 'none',
      borderRadius: '2rem',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '5px 5px 10px #2563eb, -5px -5px 10px #60a5fa',
    },
    statusBadge: {
      padding: '0.5rem 1rem',
      borderRadius: '2rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      display: 'inline-block',
    },
    statusApplied: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
    },
    statusAccepted: {
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      color: '#4f46e5',
    },
    statusRejected: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease',
    },
    modalContent: {
      backgroundColor: '#e0e0e0',
      borderRadius: '2rem',
      padding: '2rem',
      maxWidth: '800px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '35px 35px 70px #bebebe, -35px -35px 70px #ffffff',
    },
    modalHeader: {
      marginBottom: '1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: '1.5rem',
      color: '#2d2d2d',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#6b7280',
    },
    modalBody: {
      marginBottom: '1.5rem',
    },
    modalFooter: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      color: '#4a4a4a',
      fontWeight: '500',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '1rem',
      color: '#2d2d2d',
      fontSize: '1rem',
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
      minHeight: '150px',
      resize: 'vertical',
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
      outline: 'none',
    },
    select: {
      width: '100%',
      padding: '0.75rem 1rem',
      backgroundColor: '#e0e0e0',
      border: 'none',
      borderRadius: '1rem',
      color: '#2d2d2d',
      fontSize: '1rem',
      boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
      outline: 'none',
    },
    skillsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    skillItem: {
      padding: '0.5rem',
      backgroundColor: '#e0e0e0',
      borderRadius: '0.5rem',
      textAlign: 'center',
      cursor: 'pointer',
      boxShadow: '3px 3px 6px #bebebe, -3px -3px 6px #ffffff',
    },
    skillItemSelected: {
      boxShadow: 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff',
      border: '2px solid #4f46e5',
    },
    applicationItem: {
      padding: '1rem',
      backgroundColor: '#e0e0e0',
      borderRadius: '1rem',
      marginBottom: '1rem',
      boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
    },
    applicationHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '0.5rem',
    },
    applicantName: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#2d2d2d',
    },
    applicationStatus: {
      padding: '0.25rem 0.75rem',
      borderRadius: '1rem',
      fontSize: '0.85rem',
      fontWeight: '500',
    },
    applicationActions: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '0.5rem',
    },
    acceptButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#10b981',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
    },
    rejectButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 2rem',
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
  };

  // Keyframes animations
  const animations = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  useEffect(() => {
    fetchJobs();
    fetchSkills();
  }, []); // Removed dependency on user?.user_type since fetch functions are stable

  useEffect(() => {
    if (user?.user_type === 'freelancer') {
      fetchApplications();
    }
  }, [user?.user_type]); // Added dependency to fix ESLint warning

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobs();
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const [skillsRes] = await Promise.all([
        jobAPI.getSkills?.() || Promise.resolve({ data: [] })
      ]);
      setSkills(skillsRes.data || []);
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await applicationAPI.getApplications();
      setApplications(response.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    
    try {
      await applicationAPI.applyForJob({
        job_id: selectedJob.id,
        cover_letter: coverLetter,
      });
      
      setShowApplicationModal(false);
      setCoverLetter('');
      setSelectedJob(null);
      fetchApplications();
      alert('Application submitted successfully!');
    } catch (err) {
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobFormData({
      title: job.title || '',
      description: job.description || '',
      pay_per_hour: job.pay_per_hour || '',
      experience_level: job.experience_level || 'junior',
      required_skill_ids: job.required_skills?.map(s => s.id) || [],
      tech_stack_ids: job.tech_stack?.map(t => t.id) || [],
    });
    setShowJobModal(true);
  };

  const handleUpdateJob = async () => {
    try {
      await jobAPI.updateJob(editingJob.id, jobFormData);
      setShowJobModal(false);
      setEditingJob(null);
      fetchJobs();
      alert('Job updated successfully!');
    } catch (err) {
      alert('Failed to update job. Please try again.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobAPI.deleteJob(jobId);
        fetchJobs();
        alert('Job deleted successfully!');
      } catch (err) {
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  const handleViewApplications = (job) => {
    setSelectedJob(job);
    setShowApplicationsModal(true);
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await applicationAPI.updateApplication(applicationId, status);
      fetchApplications();
      alert(`Application ${status} successfully!`);
    } catch (err) {
      alert('Failed to update application status.');
    }
  };

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const hasApplied = (jobId) => {
    return applications.some(app => app.job?.id === jobId);
  };

  const getApplicationStatus = (jobId) => {
    const application = applications.find(app => app.job?.id === jobId);
    return application?.status;
  };

  const filteredJobs = jobs.filter(job => {
    if (searchTerm && !job.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !job.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filter === 'active' && !job.is_active) return false;
    if (filter === 'applied' && user?.user_type === 'freelancer') {
      return hasApplied(job.id);
    }
    if (filter === 'my-jobs' && user?.user_type === 'recruiter') {
      return job.recruiter?.id === user.id;
    }
    
    return true;
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.is_active).length,
    applied: applications.length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    myJobs: user?.user_type === 'recruiter' ? jobs.filter(j => j.recruiter?.id === user.id).length : 0,
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

  return (
    <div style={styles.container}>
      <style>{animations}</style>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>
              {user?.user_type === 'recruiter' ? 'Manage Jobs' : 'Available Jobs'}
            </h1>
            <p style={styles.subtitle}>
              {user?.user_type === 'recruiter' 
                ? 'Post, edit, and manage your job listings'
                : 'Find your next freelance opportunity'}
            </p>
          </div>
          
          {user?.user_type === 'recruiter' && (
            <a href="/recruiter/post-job" style={styles.postJobBtn}>
              + Post New Job
            </a>
          )}
        </div>

        {/* Stats Section */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.total}</div>
            <div style={styles.statLabel}>Total Jobs</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{stats.active}</div>
            <div style={styles.statLabel}>Active Jobs</div>
          </div>
          {user?.user_type === 'freelancer' && (
            <>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.applied}</div>
                <div style={styles.statLabel}>Applied</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{stats.accepted}</div>
                <div style={styles.statLabel}>Accepted</div>
              </div>
            </>
          )}
          {user?.user_type === 'recruiter' && (
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{stats.myJobs}</div>
              <div style={styles.statLabel}>My Jobs</div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search jobs by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          
          <div style={styles.filterButtons}>
            <button
              style={{
                ...styles.filterButton,
                ...(filter === 'all' ? styles.filterButtonActive : {}),
              }}
              onClick={() => setFilter('all')}
            >
              All Jobs
            </button>
            <button
              style={{
                ...styles.filterButton,
                ...(filter === 'active' ? styles.filterButtonActive : {}),
              }}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            {user?.user_type === 'freelancer' && (
              <button
                style={{
                  ...styles.filterButton,
                  ...(filter === 'applied' ? styles.filterButtonActive : {}),
                }}
                onClick={() => setFilter('applied')}
              >
                Applied
              </button>
            )}
            {user?.user_type === 'recruiter' && (
              <button
                style={{
                  ...styles.filterButton,
                  ...(filter === 'my-jobs' ? styles.filterButtonActive : {}),
                }}
                onClick={() => setFilter('my-jobs')}
              >
                My Jobs
              </button>
            )}
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>📋</div>
            <h3 style={styles.emptyStateTitle}>No Jobs Found</h3>
            <p style={styles.emptyStateText}>
              {searchTerm 
                ? 'No jobs match your search criteria'
                : user?.user_type === 'recruiter'
                  ? "You haven't posted any jobs yet. Click 'Post New Job' to get started!"
                  : 'No jobs available at the moment. Check back later!'}
            </p>
            {user?.user_type === 'recruiter' && (
              <a href="/recruiter/post-job" style={styles.postJobBtn}>
                Post Your First Job
              </a>
            )}
          </div>
        ) : (
          <div style={styles.jobsGrid}>
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                style={styles.jobCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '25px 25px 75px #bebebe, -25px -25px 75px #ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '20px 20px 60px #bebebe, -20px -20px 60px #ffffff';
                }}
              >
                <div style={styles.jobHeader}>
                  <div>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <div style={styles.jobMeta}>
                      <span style={styles.jobMetaItem}>
                        👤 {job.recruiter?.username || 'Unknown'}
                      </span>
                      <span style={styles.jobMetaItem}>
                        📅 {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                      <span style={styles.jobMetaItem}>
                        📍 {job.experience_level || 'N/A'}
                      </span>
                      {!job.is_active && (
                        <span style={{...styles.jobMetaItem, color: '#ef4444'}}>
                          ⏸️ Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p style={styles.jobDescription}>
                  {job.description?.length > 200
                    ? `${job.description.substring(0, 200)}...`
                    : job.description}
                </p>

                {job.required_skills?.length > 0 && (
                  <div style={styles.skillsContainer}>
                    {job.required_skills.slice(0, 5).map((skill) => (
                      <span key={skill.id} style={styles.skill}>
                        {skill.name}
                      </span>
                    ))}
                    {job.required_skills.length > 5 && (
                      <span style={styles.skill}>
                        +{job.required_skills.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                {job.tech_stack?.length > 0 && (
                  <div style={styles.techStack}>
                    {job.tech_stack.slice(0, 3).map((tech) => (
                      <span key={tech.id} style={styles.tech}>
                        {tech.name}
                      </span>
                    ))}
                  </div>
                )}

                <div style={styles.jobFooter}>
                  <div>
                    <span style={styles.payRate}>${job.pay_per_hour}</span>
                    <span style={styles.payPeriod}>/hour</span>
                  </div>
                  
                  <div style={styles.actionButtons}>
                    {/* Recruiter Actions */}
                    {user?.user_type === 'recruiter' && user.id === job.recruiter?.id && (
                      <>
                        <button
                          style={styles.viewApplicationsButton}
                          onClick={() => handleViewApplications(job)}
                        >
                          📋 Applications ({job.applications_count || 0})
                        </button>
                        <button
                          style={styles.editButton}
                          onClick={() => handleEditJob(job)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          style={styles.deleteButton}
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                    
                    {/* Freelancer Actions */}
                    {user?.user_type === 'freelancer' && (
                      hasApplied(job.id) ? (
                        <>
                          <span style={{
                            ...styles.statusBadge,
                            ...(getApplicationStatus(job.id) === 'accepted' ? styles.statusAccepted :
                              getApplicationStatus(job.id) === 'rejected' ? styles.statusRejected :
                              styles.statusApplied)
                          }}>
                            {getApplicationStatus(job.id)}
                          </span>
                          <button
                            style={styles.appliedButton}
                            disabled
                          >
                            ✓ Applied
                          </button>
                        </>
                      ) : (
                        <button
                          style={styles.applyButton}
                          onClick={() => openApplyModal(job)}
                        >
                          I'm Interested
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal (for freelancers) */}
      {showApplicationModal && selectedJob && (
        <div style={styles.modal} onClick={() => setShowApplicationModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Apply for {selectedJob.title}</h3>
              <button style={styles.closeButton} onClick={() => setShowApplicationModal(false)}>×</button>
            </div>
            
            <div style={styles.modalBody}>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                ${selectedJob.pay_per_hour}/hour • {selectedJob.experience_level}
              </p>
              <textarea
                placeholder="Write a cover letter (optional)"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                style={styles.textarea}
              />
            </div>
            
            <div style={styles.modalFooter}>
              <button
                style={{...styles.filterButton}}
                onClick={() => {
                  setShowApplicationModal(false);
                  setCoverLetter('');
                  setSelectedJob(null);
                }}
              >
                Cancel
              </button>
              <button
                style={styles.applyButton}
                onClick={handleApply}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal (for recruiters) */}
      {showJobModal && editingJob && (
        <div style={styles.modal} onClick={() => setShowJobModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Edit Job</h3>
              <button style={styles.closeButton} onClick={() => setShowJobModal(false)}>×</button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input
                  type="text"
                  value={jobFormData.title}
                  onChange={(e) => setJobFormData({...jobFormData, title: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({...jobFormData, description: e.target.value})}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Pay per hour ($)</label>
                <input
                  type="number"
                  value={jobFormData.pay_per_hour}
                  onChange={(e) => setJobFormData({...jobFormData, pay_per_hour: e.target.value})}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Experience Level</label>
                <select
                  value={jobFormData.experience_level}
                  onChange={(e) => setJobFormData({...jobFormData, experience_level: e.target.value})}
                  style={styles.select}
                >
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-level</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Skills</label>
                <div style={styles.skillsGrid}>
                  {skills.map(skill => (
                    <div
                      key={skill.id}
                      style={{
                        ...styles.skillItem,
                        ...(jobFormData.required_skill_ids.includes(skill.id) ? styles.skillItemSelected : {})
                      }}
                      onClick={() => {
                        const newSkills = jobFormData.required_skill_ids.includes(skill.id)
                          ? jobFormData.required_skill_ids.filter(id => id !== skill.id)
                          : [...jobFormData.required_skill_ids, skill.id];
                        setJobFormData({...jobFormData, required_skill_ids: newSkills});
                      }}
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button
                style={{...styles.filterButton}}
                onClick={() => {
                  setShowJobModal(false);
                  setEditingJob(null);
                }}
              >
                Cancel
              </button>
              <button
                style={styles.editButton}
                onClick={handleUpdateJob}
              >
                Update Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Applications Modal (for recruiters) */}
      {showApplicationsModal && selectedJob && (
        <div style={styles.modal} onClick={() => setShowApplicationsModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Applications for {selectedJob.title}</h3>
              <button style={styles.closeButton} onClick={() => setShowApplicationsModal(false)}>×</button>
            </div>
            
            <div style={styles.modalBody}>
              {selectedJob.applications?.length > 0 ? (
                selectedJob.applications.map(app => (
                  <div key={app.id} style={styles.applicationItem}>
                    <div style={styles.applicationHeader}>
                      <span style={styles.applicantName}>
                        {app.freelancer?.username}
                      </span>
                      <span style={{
                        ...styles.applicationStatus,
                        ...(app.status === 'accepted' ? styles.statusAccepted :
                          app.status === 'rejected' ? styles.statusRejected :
                          styles.statusApplied)
                      }}>
                        {app.status}
                      </span>
                    </div>
                    {app.cover_letter && (
                      <p style={{ color: '#4a4a4a', margin: '0.5rem 0' }}>
                        {app.cover_letter}
                      </p>
                    )}
                    <div style={styles.applicationActions}>
                      {app.status === 'applied' && (
                        <>
                          <button
                            style={styles.acceptButton}
                            onClick={() => handleUpdateApplicationStatus(app.id, 'accepted')}
                          >
                            Accept
                          </button>
                          <button
                            style={styles.rejectButton}
                            onClick={() => handleUpdateApplicationStatus(app.id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#6b7280' }}>
                  No applications yet
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;