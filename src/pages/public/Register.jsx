import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/Register.css';

const ROLES = [
  { val: 'garage_owner', icon: '🏢', name: 'Garage owner',  desc: 'Register and manage your garage business' },
  { val: 'car_owner',    icon: '🚗', name: 'Car owner',     desc: 'Find garages and track your car history' },
  { val: 'tow_truck',    icon: '🚛', name: 'Tow truck',     desc: 'Accept dispatch jobs near you' },
  { val: 'supplier',     icon: '📦', name: 'Supplier',      desc: 'List parts and sell to garages' },
];

const STEPS = ['Role', 'Details', 'Done'];

// Fields that change based on role
const ROLE_FIELDS = {
  garage_owner: [
    { name: 'garage_name',    label: 'Garage name',    icon: '🏢', type: 'text',  placeholder: 'e.g. Ruiru Auto Centre' },
    { name: 'address',        label: 'Garage address', icon: '📍', type: 'text',  placeholder: 'e.g. Thika Road, Ruiru' },
  ],
  car_owner: [
    { name: 'car_model',      label: 'Car model',      icon: '🚗', type: 'text',  placeholder: 'e.g. Toyota Fielder' },
    { name: 'number_plate',   label: 'Number plate',   icon: '🔢', type: 'text',  placeholder: 'e.g. KBZ 123A' },
  ],
  tow_truck: [
    { name: 'truck_plate',    label: 'Truck plate',    icon: '🚛', type: 'text',  placeholder: 'e.g. KDA 456B' },
    { name: 'area',           label: 'Operating area', icon: '📍', type: 'text',  placeholder: 'e.g. Nairobi CBD' },
  ],
  supplier: [
    { name: 'business_name',  label: 'Business name',  icon: '📦', type: 'text',  placeholder: 'e.g. AutoParts Kenya' },
    { name: 'location',       label: 'Location',       icon: '📍', type: 'text',  placeholder: 'e.g. Industrial Area, Nairobi' },
  ],
};

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep]         = useState(1);
  const [role, setRole]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // Common fields
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    password: '', confirm_password: '',

    // role-specific fields filled dynamically
    
    garage_name: '', address: '',
    car_model: '', number_plate: '',
    truck_plate: '', area: '',
    business_name: '', location: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!role) { setError('Please select a role to continue.'); return; }
      setStep(2);
    } else if (step === 2) {
      if (!form.full_name || !form.email || !form.phone || !form.password) {
        setError('Please fill in all required fields.'); return;
      }
      if (form.password !== form.confirm_password) {
        setError('Passwords do not match.'); return;
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters.'); return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/auth/register', {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: role,
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    // Auto login after register
    api.post('/auth/login', { email: form.email, password: form.password })
      .then(res => {
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('role', res.data.role);
        const routes = {
          garage_owner: '/garage/dashboard',
          car_owner:    '/customer/dashboard',
          tow_truck:    '/tow/dashboard',
          supplier:     '/supplier/dashboard',
        };
        navigate(routes[role] || '/');
      });
  };

  return (
  <div className="register-page">
    <div className="register-bg">
      <div className="register-orb register-orb-1" />
      <div className="register-orb register-orb-2" />
    </div>

      <div className="register-card">

        {/* Logo */}
        <Link to="/" className="register-logo">
          <div className="register-logo-icon">⚙</div>
          <span className="register-logo-text">GarageConnect</span>
        </Link>

        {/* Progress bar */}
        <div className="progress-wrap">
          <div className="progress-steps">
            {STEPS.map((label, i) => {
              const num = i + 1;
              const isDone   = step > num;
              const isActive = step === num;
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="progress-step">
                    <div className={`progress-dot ${isDone ? 'done' : isActive ? 'active' : ''}`}>
                      {isDone ? '✓' : num}
                    </div>
                    <span className={`progress-label ${isDone ? 'done' : isActive ? 'active' : ''}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`progress-line ${step > num ? 'done' : ''}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── STEP 1: Pick role ── */}
        {step === 1 && (
          <>
            <div className="step-title">Who are you?</div>
            <div className="step-sub">Choose your role to get started</div>

            <div className="role-cards">
              {ROLES.map(r => (
                <div
                  key={r.val}
                  className={`role-card ${role === r.val ? 'selected' : ''}`}
                  onClick={() => setRole(r.val)}
                >
                  <div className="role-card-icon">{r.icon}</div>
                  <div className="role-card-name">{r.name}</div>
                  <div className="role-card-desc">{r.desc}</div>
                </div>
              ))}
            </div>

            {error && <div className="register-error">{error}</div>}

            <button className="btn-next" style={{ width: '100%' }} onClick={handleNext}>
              Continue →
            </button>

            <div className="login-row">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </>
        )}

        {/* ── STEP 2: Fill details ── */}
        {step === 2 && (
          <>
            <div className="step-title">Create your account</div>
            <div className="step-sub">
              Registering as{' '}
              <span style={{ color: '#E87820' }}>
                {ROLES.find(r => r.val === role)?.name}
              </span>
            </div>

            {error && <div className="register-error">{error}</div>}

            {/* Common fields */}
            <div className="field">
              <label>Full name</label>
              <div className="input-wrap">
                <span className="input-icon">👤</span>
                <input type="text" placeholder="Your full name"
                  value={form.full_name} onChange={e => update('full_name', e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label>Email address</label>
              <div className="input-wrap">
                <span className="input-icon">✉</span>
                <input type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
            </div>

            <div className="field">
              <label>Phone number</label>
              <div className="input-wrap">
                <span className="input-icon">📱</span>
                <input type="tel" placeholder="+254700000000"
                  value={form.phone} onChange={e => update('phone', e.target.value)} />
              </div>
            </div>

            {/* Role-specific fields */}
            {ROLE_FIELDS[role]?.map(f => (
              <div className="field" key={f.name}>
                <label>{f.label}</label>
                <div className="input-wrap">
                  <span className="input-icon">{f.icon}</span>
                  <input type={f.type} placeholder={f.placeholder}
                    value={form[f.name]} onChange={e => update(f.name, e.target.value)} />
                </div>
              </div>
            ))}

            {/* Password row */}
            <div className="field-row-2">
              <div className="field">
                <label>Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 chars"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label>Confirm password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat password"
                    value={form.confirm_password}
                    onChange={e => update('confirm_password', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#555' }}>
                <input type="checkbox" onChange={e => setShowPassword(e.target.checked)}
                  style={{ accentColor: '#E87820' }} />
                Show passwords
              </label>
            </div>

            <div className="step-btns">
              <button className="btn-back" onClick={() => { setStep(1); setError(''); }}>← Back</button>
              <button className="btn-next" onClick={handleNext} disabled={loading}>
                {loading ? 'Creating account...' : 'Create account →'}
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Success ── */}
        {step === 3 && (
          <div className="success-wrap">
            <div className="success-icon">✓</div>
            <div className="success-title">You're all set, {form.full_name.split(' ')[0]}!</div>
            <div className="success-sub">
              Your account has been created successfully.<br />
              Welcome to GarageConnect.
            </div>
            <div className="success-role-badge">
              {ROLES.find(r => r.val === role)?.icon}{' '}
              {ROLES.find(r => r.val === role)?.name}
            </div>
            <button className="btn-next" style={{ width: '100%' }} onClick={handleGoToDashboard}>
              Go to my dashboard →
            </button>
            <div className="login-row" style={{ marginTop: 16 }}>
              <Link to="/">Back to home</Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
