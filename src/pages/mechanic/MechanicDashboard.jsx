// MechanicDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/MechanicDashboard.css';

const NAV = [
  { icon: '▦',  label: 'Overview',        id: 'overview'   },
  { icon: '🔧', label: 'My Jobs',          id: 'myjobs'     },
  { icon: '⏳', label: 'Pending',          id: 'pending'    },
  { icon: '✅', label: 'Completed',        id: 'completed'  },
  { icon: '📋', label: 'Job Requests',     id: 'requests'   },
  { icon: '📦', label: 'Parts Needed',     id: 'parts'      },
  { icon: '📊', label: 'My Performance',   id: 'performance'},
  { icon: '⚙',  label: 'Settings',         id: 'settings'   },
];

const STATUS_BADGE = {
  pending:     <span className="mechanic-badge mechanic-badge-pending">⏳ Pending</span>,
  accepted:    <span className="mechanic-badge mechanic-badge-accepted">✓ Accepted</span>,
  in_progress: <span className="mechanic-badge mechanic-badge-in_progress">🔧 In progress</span>,
  completed:   <span className="mechanic-badge mechanic-badge-completed">✅ Completed</span>,
  cancelled:   <span className="mechanic-badge mechanic-badge-cancelled">✕ Cancelled</span>,
};

export default function MechanicDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [mechanic, setMechanic] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [partsRequests, setPartsRequests] = useState([]);
  const [garage, setGarage] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedJobForReport, setSelectedJobForReport] = useState(null);
  const [reportNote, setReportNote] = useState('');
  const [reportImages, setReportImages] = useState([]);

  const name = localStorage.getItem('name') || 'Mechanic';
  const mechanicId = localStorage.getItem('mechanic_id') || localStorage.getItem('user_id');
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch mechanic profile
      const mechanicRes = await api.get('/mechanics/profile');
      setMechanic(mechanicRes.data);
      
      // Fetch my assigned jobs
      const myJobsRes = await api.get('/mechanics/my-jobs');
      setMyJobs(myJobsRes.data);
      setCompletedJobs(myJobsRes.data.filter(job => job.status === 'completed'));
      
      // Fetch available jobs from garage
      const availableRes = await api.get('/requests/available');
      setAvailableJobs(availableRes.data);
      
      // Fetch parts requests for my jobs
      const partsRes = await api.get('/mechanics/parts-requests');
      setPartsRequests(partsRes.data);
      
      // Fetch garage info
      const garageRes = await api.get('/garages/my-garage');
      setGarage(garageRes.data);
      
    } catch (err) {
      console.error('Error fetching mechanic data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    // call fetchAllData asynchronously to avoid synchronous setState in effect
    (async () => {
      if (!mounted) return;
      await fetchAllData();
    })();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      if (mounted) fetchAllData();
    }, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const updateJobStatus = async (jobId, status, data = {}) => {
    try {
      await api.patch(`/requests/${jobId}/status`, {
        status,
        mechanic_note: data.note || null,
        completed_at: status === 'completed' ? new Date().toISOString() : undefined
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert('Failed to update job status');
    }
  };

  const acceptJob = async (jobId) => {
    try {
      await api.patch(`/requests/${jobId}/accept`, { mechanic_id: mechanicId });
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert('Failed to accept job');
    }
  };

  const requestParts = async (jobId, parts) => {
    try {
      await api.post(`/requests/${jobId}/parts-request`, { parts });
      alert('Parts request sent to garage');
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert('Failed to request parts');
    }
  };

  const submitCompletionReport = async (jobId, note, images) => {
    try {
      await api.post(`/requests/${jobId}/completion-report`, {
        note,
        images,
        completed_at: new Date().toISOString()
      });
      await updateJobStatus(jobId, 'completed', { note });
      setShowReportModal(false);
      setReportNote('');
      setReportImages([]);
      setSelectedJobForReport(null);
    } catch (err) {
      console.error(err);
      alert('Failed to submit completion report');
    }
  };

  const toggleAvailability = async () => {
    try {
      await api.patch('/mechanics/toggle-availability');
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const stats = [
    {
      label: 'Active Jobs',
      value: myJobs.filter(j => j.status === 'in_progress').length,
      icon: '🔧',
      color: 'rgba(232,120,32,0.15)',
    },
    {
      label: 'Pending',
      value: myJobs.filter(j => j.status === 'accepted').length,
      icon: '⏳',
      color: 'rgba(234,179,8,0.15)',
    },
    {
      label: 'Completed',
      value: completedJobs.length,
      icon: '✅',
      color: 'rgba(34,197,94,0.15)',
    },
    {
      label: 'Available Jobs',
      value: availableJobs.length,
      icon: '📋',
      color: 'rgba(59,130,246,0.15)',
    },
  ];

  const filteredJobs = active === 'myjobs' ? myJobs :
    active === 'pending' ? myJobs.filter(j => j.status === 'accepted') :
    active === 'completed' ? completedJobs :
    myJobs;

  const showJobsTable = ['overview', 'myjobs', 'pending', 'completed'].includes(active);

  return (
    <div className="mechanic-dashboard">
      {sidebarOpen && (
        <div onClick={() => setSidebar(false)} className="mechanic-sidebar-overlay" />
      )}

      <aside className={`mechanic-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Link to="/" className="mechanic-sidebar-logo">
          <div className="mechanic-sidebar-logo-icon">🔧</div>
          <span className="mechanic-sidebar-logo-text">GarageConnect</span>
        </Link>

        <div className="mechanic-sidebar-section">
          <div className="mechanic-sidebar-section-label">Menu</div>
          {NAV.map(item => (
            <button
              key={item.id}
              className={`mechanic-sidebar-link ${active === item.id ? 'active' : ''}`}
              onClick={() => { setActive(item.id); setSidebar(false); }}
            >
              <span className="mechanic-sidebar-link-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="mechanic-sidebar-bottom">
          {mechanic && (
            <div className="mechanic-sidebar-profile">
              <div className="mechanic-sidebar-avatar">{initials}</div>
              <div className="mechanic-sidebar-name">{mechanic.name || name}</div>
              <div className="mechanic-sidebar-status">
                <div className={`mechanic-status-dot ${mechanic.is_available ? 'available' : 'busy'}`} />
                <span>{mechanic.is_available ? 'Available for jobs' : 'Busy'}</span>
              </div>
            </div>
          )}
          <button className="mechanic-sidebar-link" onClick={logout}>
            <span className="mechanic-sidebar-link-icon">🚪</span>
            Sign out
          </button>
        </div>
      </aside>

      <div className="mechanic-main">
        <div className="mechanic-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebar(o => !o)} className="mechanic-sidebar-toggle">
              ☰
            </button>
            <div>
              <div className="mechanic-topbar-title">
                {NAV.find(n => n.id === active)?.label || 'Overview'}
              </div>
              <div className="mechanic-topbar-sub">
                {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          <div className="mechanic-topbar-right">
            <button 
              className={`mechanic-availability-toggle ${mechanic?.is_available ? 'active' : ''}`}
              onClick={toggleAvailability}
            >
              {mechanic?.is_available ? '🟢 Available' : '🔴 Busy'}
            </button>
            <div className="mechanic-topbar-avatar" title={name}>{initials}</div>
          </div>
        </div>

        <div className="mechanic-content">
          {loading ? (
            <div className="mechanic-loading">Loading your dashboard...</div>
          ) : (
            <>
              {/* Overview Stats */}
              {active === 'overview' && (
                <>
                  <div className="mechanic-stats-grid">
                    {stats.map(s => (
                      <div key={s.label} className="mechanic-stat-card">
                        <div className="mechanic-stat-card-top">
                          <span className="mechanic-stat-card-label">{s.label}</span>
                          <div className="mechanic-stat-card-icon" style={{ background: s.color }}>
                            {s.icon}
                          </div>
                        </div>
                        <div className="mechanic-stat-card-value">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mechanic-quick-actions">
                    <button className="mechanic-quick-action-btn primary" onClick={() => setActive('requests')}>
                      📋 Browse available jobs
                    </button>
                    <button className="mechanic-quick-action-btn" onClick={fetchAllData}>
                      🔄 Refresh
                    </button>
                    <button className="mechanic-quick-action-btn" onClick={toggleAvailability}>
                      {mechanic?.is_available ? '🔴 Mark as busy' : '🟢 Mark available'}
                    </button>
                  </div>
                </>
              )}

              {/* Available Jobs / Requests */}
              {(active === 'requests' || (active === 'overview' && availableJobs.length > 0)) && (
                <div className="mechanic-section">
                  <div className="mechanic-section-header">
                    <div>
                      <div className="mechanic-section-title">
                        {active === 'requests' ? 'Available Jobs' : 'New job opportunities'}
                      </div>
                      <div className="mechanic-section-sub">{availableJobs.length} jobs waiting for a mechanic</div>
                    </div>
                    {active === 'overview' && availableJobs.length > 0 && (
                      <button className="mechanic-view-all" onClick={() => setActive('requests')}>
                        View all →
                      </button>
                    )}
                  </div>

                  <div className="mechanic-jobs-grid">
                    {availableJobs.slice(0, active === 'overview' ? 2 : undefined).map(job => (
                      <div key={job.id} className="mechanic-job-card">
                        <div className="mechanic-job-header">
                          <span className="mechanic-job-id">Job #{job.id}</span>
                          <span className="mechanic-job-status pending">Available</span>
                        </div>
                        <div className="mechanic-job-vehicle">
                          🚗 {job.vehicle_name || 'Vehicle'} · {job.vehicle_plate || 'No plate'}
                        </div>
                        <div className="mechanic-job-description">{job.description}</div>
                        <div className="mechanic-job-footer">
                          <button className="mechanic-accept-btn" onClick={() => acceptJob(job.id)}>
                            Accept Job
                          </button>
                        </div>
                      </div>
                    ))}
                    {availableJobs.length === 0 && active === 'requests' && (
                      <div className="mechanic-empty-state">
                        <div className="mechanic-empty-icon">✅</div>
                        <div className="mechanic-empty-title">No available jobs</div>
                        <div className="mechanic-empty-sub">Check back later for new requests</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* My Jobs Table */}
              {showJobsTable && (
                <div className="mechanic-section">
                  <div className="mechanic-section-header">
                    <div>
                      <div className="mechanic-section-title">
                        {active === 'overview' ? 'My Active Jobs' :
                         active === 'myjobs' ? 'All My Jobs' :
                         active === 'pending' ? 'Pending Jobs' : 'Completed Jobs'}
                      </div>
                      <div className="mechanic-section-sub">
                        {filteredJobs.filter(j => j.status !== 'completed').length} active · {completedJobs.length} completed
                      </div>
                    </div>
                  </div>

                  <div className="mechanic-jobs-container">
                    {filteredJobs.filter(j => j.status !== 'completed').length === 0 && active !== 'completed' ? (
                      <div className="mechanic-empty-state">
                        <div className="mechanic-empty-icon">🔧</div>
                        <div className="mechanic-empty-title">No active jobs</div>
                        <div className="mechanic-empty-sub">Accept a job from the available list to get started</div>
                      </div>
                    ) : (
                      <div className="mechanic-jobs-list">
                        {filteredJobs.map(job => (
                          <div key={job.id} className="mechanic-job-item">
                            <div className="mechanic-job-item-header">
                              <div>
                                <span className="mechanic-job-id">Job #{job.id}</span>
                                <span className="mechanic-job-vehicle-sm">
                                  {job.vehicle_name || 'Vehicle'} · {job.vehicle_plate || ''}
                                </span>
                              </div>
                              {STATUS_BADGE[job.status]}
                            </div>
                            
                            <div className="mechanic-job-item-body">
                              <div className="mechanic-job-description-full">{job.description}</div>
                              <div className="mechanic-job-meta">
                                <span>👤 Customer: {job.customer_name || `Car owner #${job.car_owner_id}`}</span>
                                <span>📅 {job.created_at ? new Date(job.created_at).toLocaleDateString() : '—'}</span>
                              </div>
                              
                              {job.parts_needed?.length > 0 && (
                                <div className="mechanic-job-parts">
                                  <span className="mechanic-parts-label">Parts needed:</span>
                                  {job.parts_needed.map((part, i) => (
                                    <span key={i} className="mechanic-part-tag">{part.name} (x{part.quantity})</span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="mechanic-job-item-actions">
                              {job.status === 'accepted' && (
                                <>
                                  <button className="mechanic-action-btn start" onClick={() => updateJobStatus(job.id, 'in_progress')}>
                                    Start Job
                                  </button>
                                  <button className="mechanic-action-btn parts" onClick={() => {
                                    const parts = prompt('Enter parts needed (comma separated):');
                                    if (parts) {
                                      const partsList = parts.split(',').map(p => ({ name: p.trim(), quantity: 1, status: 'pending' }));
                                      requestParts(job.id, partsList);
                                    }
                                  }}>
                                    Request Parts
                                  </button>
                                </>
                              )}
                              {job.status === 'in_progress' && (
                                <>
                                  <button className="mechanic-action-btn parts" onClick={() => {
                                    const parts = prompt('Enter additional parts needed:');
                                    if (parts) {
                                      const partsList = parts.split(',').map(p => ({ name: p.trim(), quantity: 1, status: 'pending' }));
                                      requestParts(job.id, partsList);
                                    }
                                  }}>
                                    + Request Parts
                                  </button>
                                  <button className="mechanic-action-btn complete" onClick={() => {
                                    setSelectedJobForReport(job);
                                    setShowReportModal(true);
                                  }}>
                                    Mark Complete
                                  </button>
                                </>
                              )}
                              {job.status === 'pending' && (
                                <button className="mechanic-action-btn accept" onClick={() => acceptJob(job.id)}>
                                  Accept Job
                                </button>
                              )}
                              {job.status === 'completed' && (
                                <span className="mechanic-completed-badge">✓ Completed on {new Date(job.completed_at).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Parts Needed Section */}
              {(active === 'parts' || (active === 'overview' && partsRequests.length > 0)) && (
                <div className="mechanic-section">
                  <div className="mechanic-section-header">
                    <div>
                      <div className="mechanic-section-title">Parts Requests</div>
                      <div className="mechanic-section-sub">Parts you've requested from the garage</div>
                    </div>
                  </div>

                  <div className="mechanic-parts-list">
                    {partsRequests.length === 0 ? (
                      <div className="mechanic-empty-state small">
                        <div className="mechanic-empty-icon">📦</div>
                        <div className="mechanic-empty-title">No parts requested</div>
                      </div>
                    ) : (
                      partsRequests.map(req => (
                        <div key={req.id} className="mechanic-part-request-card">
                          <div className="mechanic-part-request-header">
                            <span>Job #{req.job_id}</span>
                            <span className={`mechanic-part-status ${req.status}`}>
                              {req.status === 'ordered' ? '📦 Ordered' : 
                               req.status === 'received' ? '✓ Received' : '⏳ Pending'}
                            </span>
                          </div>
                          <div className="mechanic-part-request-parts">
                            {req.parts?.map((part, i) => (
                              <span key={i} className="mechanic-requested-part">{part.name} (x{part.quantity})</span>
                            ))}
                          </div>
                          {req.status === 'received' && (
                            <div className="mechanic-part-actions">
                              <button className="mechanic-action-btn small" onClick={() => alert('Mark parts as installed')}>
                                ✓ Mark Installed
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Performance Section */}
              {active === 'performance' && (
                <div className="mechanic-performance">
                  <div className="mechanic-stats-grid">
                    <div className="mechanic-stat-card">
                      <div className="mechanic-stat-card-label">Jobs Completed</div>
                      <div className="mechanic-stat-card-value">{completedJobs.length}</div>
                    </div>
                    <div className="mechanic-stat-card">
                      <div className="mechanic-stat-card-label">Avg. Completion Time</div>
                      <div className="mechanic-stat-card-value">—</div>
                    </div>
                    <div className="mechanic-stat-card">
                      <div className="mechanic-stat-card-label">Customer Rating</div>
                      <div className="mechanic-stat-card-value">★ 4.8</div>
                    </div>
                  </div>
                  
                  <div className="mechanic-performance-chart">
                    <div className="mechanic-section-title">Recent Performance</div>
                    <div className="mechanic-empty-state">
                      <div className="mechanic-empty-icon">📊</div>
                      <div className="mechanic-empty-title">Analytics coming soon</div>
                      <div className="mechanic-empty-sub">Complete more jobs to see your performance metrics</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Section */}
              {active === 'settings' && mechanic && (
                <div className="mechanic-settings-panel">
                  <div className="mechanic-section-title" style={{ marginBottom: 20 }}>Mechanic Profile</div>
                  <div className="mechanic-settings-row">
                    <span>Full Name</span>
                    <span>{mechanic.name}</span>
                  </div>
                  <div className="mechanic-settings-row">
                    <span>Specializations</span>
                    <span>{mechanic.specializations?.join(', ') || '—'}</span>
                  </div>
                  <div className="mechanic-settings-row">
                    <span>Engine Types</span>
                    <span>{mechanic.engine_types?.join(', ') || '—'}</span>
                  </div>
                  <div className="mechanic-settings-row">
                    <span>Garage</span>
                    <span>{garage?.name || '—'}</span>
                  </div>
                  <div className="mechanic-settings-row">
                    <span>Status</span>
                    <span className={mechanic.is_available ? 'available' : 'busy'}>
                      {mechanic.is_available ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Completion Report Modal */}
      {showReportModal && selectedJobForReport && (
        <div className="mechanic-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="mechanic-modal" onClick={e => e.stopPropagation()}>
            <div className="mechanic-modal-header">Complete Job #{selectedJobForReport.id}</div>
            <div className="mechanic-modal-body">
              <div className="mechanic-job-info">
                <strong>Job:</strong> {selectedJobForReport.description}
              </div>
              <label>Completion Notes</label>
              <textarea
                className="mechanic-modal-textarea"
                rows={4}
                placeholder="Describe the work done, any issues encountered, etc."
                value={reportNote}
                onChange={e => setReportNote(e.target.value)}
              />
              <label>Photos (optional)</label>
              <div className="mechanic-image-upload">
                <button className="mechanic-upload-btn" onClick={() => {
                  const url = prompt('Enter image URL:');
                  if (url) setReportImages([...reportImages, url]);
                }}>
                  + Add Photo URL
                </button>
                {reportImages.length > 0 && (
                  <div className="mechanic-image-preview">
                    {reportImages.map((img, i) => (
                      <span key={i} className="mechanic-image-tag">
                        📷 Photo {i+1}
                        <button onClick={() => setReportImages(reportImages.filter((_, idx) => idx !== i))}>✕</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mechanic-modal-footer">
              <button className="mechanic-modal-btn cancel" onClick={() => setShowReportModal(false)}>Cancel</button>
              <button className="mechanic-modal-btn save" onClick={() => submitCompletionReport(selectedJobForReport.id, reportNote, reportImages)}>
                Submit & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}