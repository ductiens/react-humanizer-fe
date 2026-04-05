import { useAppStore } from '../../store';
import { STYLE_OPTIONS, INTENSITY_OPTIONS, LANGUAGE_OPTIONS } from '../../constants';

const SelectGroup = ({ title, options, value, onChange }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{title}</label>
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {options.map((opt: any) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: isSelected ? 'var(--accent-primary)' : 'var(--bg-surface)',
              border: `1px solid ${isSelected ? 'var(--accent-secondary)' : 'var(--border-light)'}`,
              color: isSelected ? 'white' : 'var(--text-primary)',
              transition: 'all 0.2s ease',
              boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
              fontSize: '0.875rem',
            }}
            title={opt.description}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);

const ToggleSwitch = ({ title, description, checked, onChange }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-light)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>{title}</label>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '40px',
          height: '24px',
          borderRadius: '12px',
          background: checked ? 'var(--accent-secondary)' : 'var(--bg-dark)',
          position: 'relative',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
      >
        <div style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: '3px',
          left: checked ? '19px' : '3px',
          transition: 'all 0.3s'
        }} />
      </button>
    </div>
    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{description}</span>
  </div>
);

const StyleSelector = () => {
  const { style, intensity_level, language, simulateStudent, setSettings } = useAppStore();

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: 'var(--accent-secondary)' }}>✧</span> Customization Setup
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <SelectGroup 
          title="Writing Style" 
          options={STYLE_OPTIONS} 
          value={style} 
          onChange={(v: string) => setSettings({ style: v })} 
        />
        <SelectGroup 
          title="Intensity Level" 
          options={INTENSITY_OPTIONS} 
          value={intensity_level} 
          onChange={(v: string) => setSettings({ intensity_level: v })} 
        />
        <SelectGroup 
          title="Output Language" 
          options={LANGUAGE_OPTIONS} 
          value={language} 
          onChange={(v: string) => setSettings({ language: v })} 
        />
        <ToggleSwitch
          title="🎓 Mô phỏng sinh viên viết"
          description="Cố tình chèn lỗi lặp từ / lóng nhẹ để dễ gạt Tool AI"
          checked={simulateStudent}
          onChange={(v: boolean) => setSettings({ simulateStudent: v })}
        />
      </div>
    </div>
  );
};

export default StyleSelector;
