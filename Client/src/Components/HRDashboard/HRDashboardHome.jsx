// components/HRDashboard/HRDashboardHome.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFileAlt, 
  FaUserPlus, 
  FaCalendarAlt, 
  FaChartBar, 
  FaUser,
  FaCalendar,
  FaVoicemail,
  FaUserCheck,
  FaChalkboardTeacher,
  FaCashRegister,
  FaRegRegistered,
  FaRegistered,
  FaNewspaper,
  FaRegNewspaper,
  FaEnvelopeOpen
} from 'react-icons/fa';

const HRDashboardHome = () => {
  const [stats, setStats] = useState({
    totalVacancies: 0,
    activeCandidates: 0,
    interviewsToday: 0,
    newApplications: 0,
    shortlistedCandidates: 0
  });

  const [recentCandidates, setRecentCandidates] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [businessAssociates, setBusinessAssociates] = useState([]);

  useEffect(() => {
    loadDashboardData();

    // Also load business associates
    const associates = JSON.parse(localStorage.getItem('businessAssociates')) || [];
    setBusinessAssociates(associates);
  }, []);

  const loadDashboardData = () => {
    const vacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    
    const today = new Date().toDateString();
    const interviewsToday = candidates.filter(candidate => 
      candidate.interviewDate && new Date(candidate.interviewDate).toDateString() === today
    );

    const recentCands = candidates
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const upcomingInt = candidates
      .filter(candidate => 
        candidate.interviewDate && 
        new Date(candidate.interviewDate) > new Date() &&
        new Date(candidate.interviewDate) <= threeDaysFromNow
      )
      .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
      .slice(0, 5);

    setStats({
      totalVacancies: vacancies.length,
      activeCandidates: candidates.length,
      interviewsToday: interviewsToday.length,
      newApplications: candidates.filter(c => c.currentStage === 'Career Enquiry').length,
      shortlistedCandidates: candidates.filter(c => c.shortlisted).length
    });

    setRecentCandidates(recentCands);
    setUpcomingInterviews(upcomingInt);
  };

  const quickActions = [
    { 
      name: 'Create Vacancy', 
      href: '/dashboard/vacancies', 
      icon: <FaFileAlt />, 
      colorClass: 'blue' 
    },
    { 
      name: 'Add Candidate', 
      href: '/dashboard/recruitment', 
      icon: <FaUserPlus />, 
      colorClass: 'green' 
    },
    { 
      name: 'Schedule Interview', 
      href: '/dashboard/recruitment', 
      icon: <FaCalendarAlt />, 
      colorClass: 'purple' 
    },
    { 
      name: 'View Reports', 
      href: '/dashboard/analytics', 
      icon: <FaChartBar />, 
      colorClass: 'orange' 
    },
  ];

  const getStageColor = (stage) => {
    const colors = {
      'Career Enquiry': 'badge bg-primary',
      'Resume Shortlisted': 'badge bg-info',
      'Interview Process': 'badge bg-warning text-dark',
      'Selected': 'badge bg-success',
      'Joining Data': 'badge bg-secondary'
    };
    return colors[stage] || 'badge bg-secondary';
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="fade-in" style={{padding: '0'}}>
      {/* Header Section */}
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark mb-1">Dashboard Overview</h1>
        <p className="text-muted mb-0">Welcome back! Here's your recruitment summary</p>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="hr-stat-card h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="small fw-medium text-muted mb-1">Total Vacancies</p>
                <p className="h3 fw-bold text-dark mb-0">{stats.totalVacancies}</p>
                <p className="small text-muted mt-1 mb-0">Active positions</p>
              </div>
              <div className="hr-stat-icon bg-primary bg-opacity-10">
                <span className="text-primary"><FaFileAlt/></span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="hr-stat-card h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="small fw-medium text-muted mb-1">Active Candidates</p>
                <p className="h3 fw-bold text-dark mb-0">{stats.activeCandidates}</p>
                <p className="small text-muted mt-1 mb-0">In pipeline</p>
              </div>
              <div className="hr-stat-icon bg-success bg-opacity-10">
                <span className="text-success"><FaUser/></span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="hr-stat-card h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="small fw-medium text-muted mb-1">Interviews Today</p>
                <p className="h3 fw-bold text-dark mb-0">{stats.interviewsToday}</p>
                <p className="small text-muted mt-1 mb-0">Scheduled</p>
              </div>
              <div className="hr-stat-icon bg-info bg-opacity-10">
                <span className="text-info"><FaCalendar/></span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="hr-stat-card h-100">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <p className="small fw-medium text-muted mb-1">Business Associates</p>
                <p className="h3 fw-bold text-dark mb-0">{businessAssociates.length}</p>
                <p className="small text-muted mt-1 mb-0">Total Associates</p>
              </div>
              <div className="hr-stat-icon bg-warning bg-opacity-10">
                <span className="text-warning"><FaUserCheck/></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity Grid */}
      <div className="row g-3 mb-4">
        {/* Quick Actions - Takes 1/3 on large screens */}
        <div className="col-12 col-xl-4">
          <div className="hr-form-card h-100">
            <h2 className="h6 fw-semibold text-dark mb-3">Quick Actions</h2>
            <div>
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  to={action.href}
                  className={`hr-quick-action-btn ${action.colorClass}`}
                >
                  <span className="me-3 fs-5">{action.icon}</span>
                  <span className="grow">{action.name}</span>
                  <span>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity - Takes 2/3 on large screens */}
        <div className="col-12 col-xl-8">
          <div className="row g-3">
            {/* Recent Candidates */}
            <div className="col-12 col-lg-6">
              <div className="hr-form-card h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h2 className="h6 fw-semibold text-dark mb-0">Recent Candidates</h2>
                  <Link 
                    to="/dashboard/recruitment" 
                    className="small text-primary text-decoration-none fw-medium"
                  >
                    View all
                  </Link>
                </div>
                <div>
                  {recentCandidates.length > 0 ? (
                    recentCandidates.map((candidate) => (
                      <div key={candidate.id} className="hr-candidate-card mb-2">
                        <div className="d-flex align-items-center">
                          <div className="hr-user-avatar rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 shrink-0" style={{width: '40px', height: '40px', fontSize: '0.875rem', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}>
                            {candidate.candidateName.charAt(0)}
                          </div>
                          <div className="grow min-w-0">
                            <p className="fw-medium text-dark mb-0 text-truncate small">{candidate.candidateName}</p>
                            <p className="small text-muted mb-0 text-truncate">{candidate.designation}</p>
                          </div>
                          <span className={`badge ${getStageColor(candidate.currentStage)} shrink-0 ms-2`} style={{fontSize: '0.65rem'}}>
                            {candidate.currentStage.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted">
                      <div className="h3 mb-2">👤</div>
                      <p className="small mb-0">No candidates yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="col-12 col-lg-6">
              <div className="hr-form-card h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h2 className="h6 fw-semibold text-dark mb-0">Upcoming Interviews</h2>
                  <Link 
                    to="/dashboard/recruitment" 
                    className="small text-primary text-decoration-none fw-medium"
                  >
                    View all
                  </Link>
                </div>
                <div>
                  {upcomingInterviews.length > 0 ? (
                    upcomingInterviews.map((interview) => (
                      <div key={interview.id} className="hr-candidate-card mb-2">
                        <div className="d-flex align-items-center">
                          <div className="hr-user-avatar rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3 shrink-0" style={{width: '40px', height: '40px', fontSize: '0.875rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'}}>
                            {interview.candidateName.charAt(0)}
                          </div>
                          <div className="grow min-w-0">
                            <p className="fw-medium text-dark mb-0 text-truncate small">{interview.candidateName}</p>
                            <p className="small text-muted mb-0 text-truncate">{interview.designation}</p>
                          </div>
                          <div className="text-end shrink-0 ms-2">
                            <p className="small fw-medium text-dark mb-0">
                              {new Date(interview.interviewDate).toLocaleDateString('en-GB')}
                            </p>
                            <p className="small text-muted mb-0">
                              {formatTime(interview.interviewDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted">
                      <div className="h3 mb-2">📅</div>
                      <p className="small mb-0">No upcoming interviews</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="hr-form-card">
        <h2 className="h6 fw-semibold text-dark mb-3">Recruitment Performance</h2>
        <div className="row g-2 g-md-3">
          <div className="col-6 col-md-3">
            <div className="text-center p-3 bg-primary bg-opacity-10 rounded">
              <div className="h4 fw-bold text-primary mb-1">
                {stats.shortlistedCandidates}
              </div>
              <p className="small fw-medium text-dark mb-0">Shortlisted</p>
              <p className="small text-muted mb-0" style={{fontSize: '0.7rem'}}>Candidates</p>
            </div>
          </div>
          
          <div className="col-6 col-md-3">
            <div className="text-center p-3 bg-success bg-opacity-10 rounded">
              <div className="h4 fw-bold text-success mb-1">
                {Math.round((stats.shortlistedCandidates / stats.activeCandidates) * 100) || 0}%
              </div>
              <p className="small fw-medium text-dark mb-0">Success Rate</p>
              <p className="small text-muted mb-0" style={{fontSize: '0.7rem'}}>Selection ratio</p>
            </div>
          </div>
          
          <div className="col-6 col-md-3">
            <div className="text-center p-3 bg-info bg-opacity-10 rounded">
              <div className="h4 fw-bold text-info mb-1">
                {Math.round(stats.activeCandidates / Math.max(stats.totalVacancies, 1))}
              </div>
              <p className="small fw-medium text-dark mb-0">Avg. per Vacancy</p>
              <p className="small text-muted mb-0" style={{fontSize: '0.7rem'}}>Candidates</p>
            </div>
          </div>
          
          <div className="col-6 col-md-3">
            <div className="text-center p-3 bg-warning bg-opacity-10 rounded">
              <div className="h4 fw-bold text-warning mb-1">
                {stats.interviewsToday}
              </div>
              <p className="small fw-medium text-dark mb-0">Today's Schedule</p>
              <p className="small text-muted mb-0" style={{fontSize: '0.7rem'}}>Interviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboardHome;
