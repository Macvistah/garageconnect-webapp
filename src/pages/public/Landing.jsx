import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import HeroCanvas from '../../components/HeroCanvas';

const services = [
  { icon: '🔧', name: 'Engine repair', desc: 'Full diagnostics & overhaul from certified mechanics' },
  { icon: '🚛', name: 'Tow truck', desc: 'Nearest tow truck dispatched in under 5 minutes' },
  { icon: '⚡', name: 'Electrical', desc: 'Battery, wiring, alternator and starter issues' },
  { icon: '🛠', name: 'General service', desc: 'Oil change, brakes, tyres and routine maintenance' },
];

const garages = [
  { name: 'Ruiru Auto Centre', dist: '0.8 km', open: true, services: 'Engine, electrical' },
  { name: 'Thika Road Motors', dist: '1.4 km', open: true, services: 'Full service' },
  { name: 'Kasarani Garage', dist: '2.1 km', open: false, services: 'Tyres, brakes' },
];

const suppliers = [
  { name: 'AutoParts Kenya', parts: [['Brake pads (Toyota)', 'KES 2,400'], ['Oil filter', 'KES 850'], ['Air filter', 'KES 1,100']] },
  { name: 'Mombasa Spares', parts: [['Alternator belt', 'KES 1,800'], ['Spark plugs (x4)', 'KES 3,200'], ['Coolant 1L', 'KES 650']] },
  { name: 'Nakuru Auto', parts: [['Amaron battery 55Ah', 'KES 8,500'], ['Wiper blades', 'KES 900'], ['Engine oil 5L', 'KES 2,800']] },
];

const history = [
  { date: 'Today 10:42 AM', garage: 'Ruiru Auto Centre', work: 'Replacing brake fluid · Brake pads inspection in progress...', cost: 'KES 2,800 so far', live: true },
  { date: '12 Jun 9:15 AM', garage: 'Thika Road Motors', work: 'Full service — oil change, air filter, spark plugs replaced.', cost: 'KES 6,500 · Paid', live: false },
  { date: '3 Mar 2:00 PM', garage: 'Kasarani Garage', work: 'Battery replacement — Amaron 55Ah installed.', cost: 'KES 8,200 · Paid', live: false },
];

export default function Landing() {
  const navigate = useNavigate();

  const S = {
    section: { padding: '48px 40px' },
    label: { fontSize: 11, fontWeight: 500, color: '#E87820', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 },
    title: { fontSize: 26, fontWeight: 500, letterSpacing: '-0.4px', marginBottom: 8, color: '#fff' },
    sub: { fontSize: 14, color: '#666', marginBottom: 32, lineHeight: 1.6 },
    card: { background: '#111', border: '0.5px solid #1e1e1e', borderRadius: 10, padding: '20px 16px' },
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <div style={{ position: 'relative', minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 40px', overflow: 'hidden' }}>
        <HeroCanvas />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.72)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 600 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(232,120,32,0.15)', border: '0.5px solid rgba(232,120,32,0.35)', borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#E87820', marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E87820', display: 'inline-block' }} />
            2,400+ garages live across Kenya
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.8px', marginBottom: 16, color: '#fff' }}>
            Your car broke down?<br /><span style={{ color: '#E87820' }}>Help is 3 minutes away.</span>
          </h1>
          <p style={{ fontSize: 15, color: '#888', lineHeight: 1.7, marginBottom: 32 }}>
            Find trusted garages, dispatch tow trucks, track your repair in real time — all without a single phone call.
          </p>
          <div style={{ display: 'flex', background: '#161616', border: '0.5px solid #2a2a2a', borderRadius: 10, overflow: 'hidden', maxWidth: 480, margin: '0 auto' }}>
            <input placeholder="Search by location, problem or garage name..." style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px 16px', fontSize: 14, color: '#fff', outline: 'none' }} />
            <button className="btn-orange" style={{ borderRadius: 0, whiteSpace: 'nowrap' }}>Find help now</button>
          </div>
        </div>
      </div>

      {/* Services */}
      <div style={S.section}>
        <div style={S.label}>What we offer</div>
        <div style={S.title}>Every car service, one platform</div>
        <div style={S.sub}>Browse services before you commit — see pricing, availability and ratings.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          {services.map(s => (
            <div key={s.name} style={{ ...S.card, cursor: 'pointer' }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: '#555', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Garages */}
      <div style={{ ...S.section, background: '#0f0f0f', borderTop: '0.5px solid #1a1a1a', borderBottom: '0.5px solid #1a1a1a' }}>
        <div style={S.label}>Live map</div>
        <div style={S.title}>Garages & tow trucks near you</div>
        <div style={S.sub}>Real-time availability — green means open right now.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {garages.map(g => (
            <div key={g.name} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{g.name}</div>
                <div style={{ fontSize: 12, color: '#555' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: g.open ? '#22c55e' : '#ef4444', display: 'inline-block', marginRight: 5 }} />
                  <span style={{ color: g.open ? '#22c55e' : '#ef4444' }}>{g.open ? 'Open' : 'Closed'}</span>
                  {' · '}{g.services}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: '#E87820', background: '#1a0e00', borderRadius: 4, padding: '2px 8px' }}>{g.dist}</span>
                {g.open && <button className="btn-orange" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => navigate('/login')}>Request</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Car History Preview */}
      <div style={{ ...S.section, background: '#0a0a0a', borderBottom: '0.5px solid #1a1a1a' }}>
        <div style={S.label}>Car history</div>
        <div style={S.title}>Every repair, tracked forever</div>
        <div style={S.sub}>Log in to see your car's full service history — updated live by your mechanic as work happens.</div>
        <div style={{ background: '#111', border: '0.5px solid #1e1e1e', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: '0.5px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#aaa' }}>Toyota Fielder · KBZ 123A</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#22c55e', background: '#0d1f10', borderRadius: 4, padding: '2px 8px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Mechanic updating now
            </span>
          </div>
          {history.map((h, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', borderBottom: i < history.length - 1 ? '0.5px solid #161616' : 'none' }}>
              <div style={{ padding: '20px 16px', fontSize: 12, color: '#444', borderRight: '0.5px solid #161616' }}>{h.date}</div>
              <div style={{ padding: '20px 20px' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {h.garage}
                  {h.live && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#22c55e', background: '#0d1f10', borderRadius: 4, padding: '2px 7px' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Live
                  </span>}
                </div>
                <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6, marginBottom: 8 }}>{h.work}</div>
                <div style={{ fontSize: 13, color: '#E87820', fontWeight: 500 }}>{h.cost}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button className="btn-orange" onClick={() => navigate('/login')}>View your full car history →</button>
        </div>
      </div>

      {/* Suppliers */}
      <div style={S.section}>
        <div style={S.label}>Suppliers</div>
        <div style={S.title}>Parts pricing, no surprises</div>
        <div style={S.sub}>Browse genuine and aftermarket parts from verified suppliers before your garage visit.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {suppliers.map(s => (
            <div key={s.name} style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{s.name}</span>
                <span style={{ fontSize: 11, color: '#E87820', background: '#1a0e00', padding: '2px 8px', borderRadius: 4 }}>Verified</span>
              </div>
              {s.parts.map(([name, price]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '0.5px solid #1a1a1a', fontSize: 12 }}>
                  <span style={{ color: '#888' }}>{name}</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{price}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '60px 40px', textAlign: 'center', borderTop: '0.5px solid #1a1a1a' }}>
        <h2 style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.5px', marginBottom: 12, color: '#fff' }}>Ready to connect your garage<br />to thousands of customers?</h2>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 32 }}>Join 2,400+ garages already on GarageConnect — free to start.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn-orange" style={{ padding: '12px 28px', fontSize: 14 }} onClick={() => navigate('/register')}>Register your garage →</button>
          <button className="btn-ghost" style={{ padding: '12px 28px', fontSize: 14 }} onClick={() => navigate('/login')}>Sign in as customer</button>
        </div>
      </div>
    </div>
  );
}
