// ── StatCard ─────────────────────────────────────────────────
interface StatCardProps {
  label: string; value: string; sub?: string;
  bg?: string; border?: string; valueColor?: string; subColor?: string; labelFont?: string;
}
export function StatCard({ label, value, sub, bg = 'rgba(0,242,255,0.06)', border = 'rgba(0,242,255,0.14)', valueColor = '#00f2ff', subColor, labelFont }: StatCardProps) {
  return (
    <div className="stat-card" style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="stat-label" style={labelFont ? { fontFamily: labelFont } : undefined}>{label}</div>
      <div className="stat-val" style={{ color: valueColor }}>{value}</div>
      {sub && <div className="stat-sub" style={subColor ? { color: subColor, opacity: 1 } : undefined}>{sub}</div>}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan'|'green'|'gold'|'red'|'purple'|'teal'|'gray';
  style?: React.CSSProperties;
}
export function Badge({ children, variant = 'cyan', style }: BadgeProps) {
  return <span className={`badge badge-${variant}`} style={style}>{children}</span>;
}

// ── ProgressBar ──────────────────────────────────────────────
interface ProgressBarProps { pct: number; colorClass?: string; style?: React.CSSProperties; }
export function ProgressBar({ pct, colorClass = 'pbar-cyan', style }: ProgressBarProps) {
  return (
    <div className="pbar">
      <div className={`pbar-fill ${colorClass}`} style={{ width: `${Math.min(100, pct)}%`, ...style }} />
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────
interface ToggleProps { on: boolean; onChange: (v: boolean) => void; accentColor?: string; }
export function Toggle({ on, onChange, accentColor }: ToggleProps) {
  return (
    <div
      className={`ff-toggle ${on ? 'on' : ''}`}
      onClick={() => onChange(!on)}
      role="switch" aria-checked={on} tabIndex={0}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') onChange(!on); }}
      style={accentColor && on ? {} : undefined}
    >
      <div className="ff-toggle-track" style={on && accentColor ? { background: `${accentColor}30`, borderColor: `${accentColor}60` } : undefined} />
      <div className="ff-toggle-knob" style={on && accentColor ? { background: accentColor } : undefined} />
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────
export function EmptyState({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="empty-state">
      <div className="ei">{icon}</div>
      <div style={{ fontWeight: 600, marginBottom: sub ? 6 : 0 }}>{title}</div>
      {sub && <div style={{ fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <i className="fas fa-circle-notch spinning" style={{ fontSize: size, color: '#00f2ff' }} />
  );
}
