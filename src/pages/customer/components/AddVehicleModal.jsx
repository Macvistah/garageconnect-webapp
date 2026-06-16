import { useState, useRef, useEffect } from 'react';
import { CAR_BRANDS } from '../../../data/carData';

const YEARS = Array.from({ length: 30 }, (_, i) => 2025 - i);
const COLORS = [
  'White', 'Silver', 'Black', 'Grey', 'Blue', 'Red',
  'Green', 'Brown', 'Gold', 'Maroon', 'Orange', 'Yellow',
];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

export default function AddVehicleModal({ onClose, onSave }) {
  const [brand, setBrand]       = useState('');
  const [model, setModel]       = useState('');
  const [year, setYear]         = useState('');
  const [color, setColor]       = useState('');
  const [fuel, setFuel]         = useState('');
  const [plate, setPlate]       = useState('');
  const [mileage, setMileage]   = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [showBrands, setShowBrands]   = useState(false);
  const [showModels, setShowModels]   = useState(false);
  const brandRef = useRef(null);
  const modelRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target)) setShowBrands(false);
      if (modelRef.current && !modelRef.current.contains(e.target)) setShowModels(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredBrands = Object.keys(CAR_BRANDS).filter(b =>
    b.replace('_', ' ').toLowerCase().includes(brandSearch.toLowerCase())
  );

  const models = brand ? CAR_BRANDS[brand.replace(' ', '_')] || CAR_BRANDS[brand] || [] : [];

  const handleSave = () => {
    if (!brand || !model || !plate) return;
    onSave({
      name: `${brand.replace('_', ' ')} ${model}`,
      brand,
      model,
      plate: plate.toUpperCase(),
      year,
      color,
      fuel,
      mileage: mileage ? `${mileage} km` : '',
      status: 'ok',
      history: [],
      totalSpent: 'KES 0',
      repairs: 0,
    });
  };

  const S = {
    overlay: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: 20,
    },
    modal: {
      background: '#111', border: '0.5px solid #2a2a2a', borderRadius: 16,
      padding: 28, width: '100%', maxWidth: 480, position: 'relative',
      maxHeight: '90vh', overflowY: 'auto',
    },
    glow: {
      position: 'absolute', top: 0, left: '20%', right: '20%',
      height: 1, background: 'linear-gradient(90deg, transparent, #E87820, transparent)',
    },
    title: { fontSize: 17, fontWeight: 500, color: '#fff', marginBottom: 4 },
    sub: { fontSize: 13, color: '#555', marginBottom: 24 },
    field: { marginBottom: 14, position: 'relative' },
    label: { display: 'block', fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' },
    input: {
      width: '100%', background: '#0d0d0d', border: '0.5px solid #252525',
      borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff',
      outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s',
      cursor: 'pointer',
    },
    dropdown: {
      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
      background: '#161616', border: '0.5px solid #2a2a2a', borderRadius: 8,
      maxHeight: 200, overflowY: 'auto', marginTop: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    },
    dropItem: {
      padding: '10px 14px', fontSize: 13, color: '#aaa', cursor: 'pointer',
      transition: 'all 0.1s', borderBottom: '0.5px solid #1a1a1a',
    },
    searchInput: {
      width: '100%', background: '#0d0d0d', border: 'none',
      borderBottom: '0.5px solid #222', padding: '10px 14px', fontSize: 13,
      color: '#fff', outline: 'none', fontFamily: 'inherit',
    },
    row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
    select: {
      width: '100%', background: '#0d0d0d', border: '0.5px solid #252525',
      borderRadius: 8, padding: '10px 14px', fontSize: 14, color: '#fff',
      outline: 'none', fontFamily: 'inherit', appearance: 'none', cursor: 'pointer',
    },
    btnRow: { display: 'flex', gap: 10, marginTop: 20 },
    cancel: {
      flex: 1, padding: 10, borderRadius: 8, fontSize: 13, cursor: 'pointer',
      background: 'transparent', border: '0.5px solid #2a2a2a', color: '#555',
      fontFamily: 'inherit', transition: 'all 0.15s',
    },
    save: {
      flex: 2, padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 500,
      cursor: !brand || !model || !plate ? 'not-allowed' : 'pointer',
      background: !brand || !model || !plate
        ? '#1a1a1a'
        : 'linear-gradient(135deg, #E87820, #cf6a15)',
      border: 'none', color: !brand || !model || !plate ? '#444' : '#fff',
      fontFamily: 'inherit', transition: 'all 0.2s',
      boxShadow: brand && model && plate ? '0 0 16px rgba(232,120,32,0.25)' : 'none',
    },
  };

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={S.glow} />
        <div style={S.title}>Add a vehicle</div>
        <div style={S.sub}>Select your car brand and model</div>

        {/* Brand picker */}
        <div style={S.field} ref={brandRef}>
          <label style={S.label}>Car brand *</label>
          <div
            style={{ ...S.input, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => { setShowBrands(o => !o); setShowModels(false); }}
          >
            <span style={{ color: brand ? '#fff' : '#2a2a2a' }}>
              {brand ? brand.replace('_', ' ') : 'Select brand...'}
            </span>
            <span style={{ color: '#444', fontSize: 12 }}>{showBrands ? '▲' : '▼'}</span>
          </div>
          {showBrands && (
            <div style={S.dropdown}>
              <input
                style={S.searchInput}
                placeholder="Search brand..."
                value={brandSearch}
                onChange={e => setBrandSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
                autoFocus
              />
              {filteredBrands.map(b => (
                <div
                  key={b}
                  style={S.dropItem}
                  onMouseEnter={e => e.target.style.background = 'rgba(232,120,32,0.08)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                  onClick={() => {
                    setBrand(b);
                    setModel('');
                    setShowBrands(false);
                    setBrandSearch('');
                  }}
                >
                  {b.replace('_', ' ')}
                </div>
              ))}
              {filteredBrands.length === 0 && (
                <div style={{ padding: '12px 14px', fontSize: 13, color: '#444' }}>No results</div>
              )}
            </div>
          )}
        </div>

        {/* Model picker */}
        <div style={S.field} ref={modelRef}>
          <label style={S.label}>Model *</label>
          <div
            style={{
              ...S.input,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              opacity: !brand ? 0.4 : 1,
              cursor: !brand ? 'not-allowed' : 'pointer',
            }}
            onClick={() => { if (brand) { setShowModels(o => !o); setShowBrands(false); } }}
          >
            <span style={{ color: model ? '#fff' : '#2a2a2a' }}>
              {model || 'Select model...'}
            </span>
            <span style={{ color: '#444', fontSize: 12 }}>{showModels ? '▲' : '▼'}</span>
          </div>
          {showModels && brand && (
            <div style={S.dropdown}>
              {models.map(m => (
                <div
                  key={m}
                  style={S.dropItem}
                  onMouseEnter={e => e.target.style.background = 'rgba(232,120,32,0.08)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                  onClick={() => { setModel(m); setShowModels(false); }}
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected car preview */}
        {brand && model && (
          <div style={{
            padding: '10px 14px', background: 'rgba(232,120,32,0.08)',
            border: '0.5px solid rgba(232,120,32,0.2)', borderRadius: 8,
            fontSize: 13, color: '#E87820', marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            🚗 {brand.replace('_', ' ')} {model}
          </div>
        )}

        {/* Number plate */}
        <div style={S.field}>
          <label style={S.label}>Number plate *</label>
          <input
            style={{ ...S.input, cursor: 'text', textTransform: 'uppercase' }}
            placeholder="e.g. KBZ 123A"
            value={plate}
            onChange={e => setPlate(e.target.value.toUpperCase())}
          />
        </div>

        {/* Year & Color */}
        <div style={S.row2}>
          <div style={S.field}>
            <label style={S.label}>Year</label>
            <select style={S.select} value={year} onChange={e => setYear(e.target.value)}>
              <option value="">Select year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={S.field}>
            <label style={S.label}>Color</label>
            <select style={S.select} value={color} onChange={e => setColor(e.target.value)}>
              <option value="">Select color</option>
              {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Fuel & Mileage */}
        <div style={S.row2}>
          <div style={S.field}>
            <label style={S.label}>Fuel type</label>
            <select style={S.select} value={fuel} onChange={e => setFuel(e.target.value)}>
              <option value="">Select fuel</option>
              {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div style={S.field}>
            <label style={S.label}>Mileage (km)</label>
            <input
              style={{ ...S.input, cursor: 'text' }}
              placeholder="e.g. 48200"
              type="number"
              value={mileage}
              onChange={e => setMileage(e.target.value)}
            />
          </div>
        </div>

        <div style={S.btnRow}>
          <button style={S.cancel} onClick={onClose}>Cancel</button>
          <button style={S.save} onClick={handleSave} disabled={!brand || !model || !plate}>
            Save vehicle →
          </button>
        </div>
      </div>
    </div>
  );
}
