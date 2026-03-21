'use client';

// ── Base skeleton block ──────────────────────────────────────
const s: React.CSSProperties = {
  background: 'linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.08) 50%, rgba(255,255,255,.04) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: 8,
};

function Bone({ w = '100%', h = 16, r = 8, style }: { w?: number|string; h?: number; r?: number; style?: React.CSSProperties }) {
  return <div style={{ width: w, height: h, borderRadius: r, ...s, ...style }} />;
}

// ── Stat row skeleton ────────────────────────────────────────
export function StatRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="stat-row">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="stat-card" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
          <Bone h={10} w="60%" style={{ marginBottom: 10 }} />
          <Bone h={28} w="80%" style={{ marginBottom: 8 }} />
          <Bone h={10} w="40%" />
        </div>
      ))}
    </div>
  );
}

// ── Chart skeleton ───────────────────────────────────────────
export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Bone h={14} w={140} />
        <Bone h={20} w={50} r={5} />
      </div>
      <div style={{ height, background: 'rgba(255,255,255,.02)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
        <Bone h="100%" w="100%" r={0} />
      </div>
    </div>
  );
}

// ── Transaction list skeleton ────────────────────────────────
export function TxListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div style={{ background: 'rgba(15,23,42,.72)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 14, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Bone h={14} w={120} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Bone h={28} w={90} r={7} />
          <Bone h={28} w={110} r={7} />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < rows - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
          <Bone h={38} w={38} r={9} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <Bone h={13} w="60%" style={{ marginBottom: 6 }} />
            <Bone h={10} w="30%" />
          </div>
          <div style={{ textAlign: 'right' }}>
            <Bone h={14} w={70} style={{ marginBottom: 6 }} />
            <Bone h={10} w={50} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Module grid skeleton ─────────────────────────────────────
export function ModuleGridSkeleton() {
  return (
    <div className="g3" style={{ marginBottom: 28 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ background: 'rgba(15,20,35,.55)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <Bone h={44} w={44} r={11} />
            <Bone h={20} w={50} r={5} />
          </div>
          <Bone h={13} w="70%" style={{ marginBottom: 8 }} />
          <Bone h={11} w="50%" />
        </div>
      ))}
    </div>
  );
}

// ── Full dashboard skeleton ──────────────────────────────────
export function DashboardSkeleton() {
  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <Bone h={32} w={280} style={{ marginBottom: 10 }} />
        <Bone h={13} w={340} />
      </div>
      <StatRowSkeleton cols={4} />
      <Bone h={14} w={130} style={{ marginBottom: 16 }} />
      <ModuleGridSkeleton />
      <div className="g2">
        <ChartSkeleton height={200} />
        <div style={{ background: 'rgba(15,20,35,.55)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 22 }}>
          <Bone h={14} w={140} style={{ marginBottom: 16 }} />
          {[100, 80, 90].map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <Bone h={16} w={16} r={3} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Bone h={12} w={`${w}%`} style={{ marginBottom: 5 }} />
                <Bone h={10} w="60%" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Generic page skeleton ─────────────────────────────────────
export function PageSkeleton({ title = true, rows = 4 }: { title?: boolean; rows?: number }) {
  return (
    <>
      {title && (
        <div style={{ marginBottom: 24 }}>
          <Bone h={24} w={200} style={{ marginBottom: 8 }} />
          <Bone h={13} w={300} />
        </div>
      )}
      <StatRowSkeleton cols={4} />
      <div className="g2" style={{ marginBottom: 20 }}>
        <ChartSkeleton height={180} />
        <ChartSkeleton height={180} />
      </div>
      <TxListSkeleton rows={rows} />
    </>
  );
}

// ── CSS for shimmer animation (add to globals.css) ────────────
// @keyframes shimmer { to { background-position: -200% 0; } }
export const SHIMMER_KEYFRAME = `@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`;
