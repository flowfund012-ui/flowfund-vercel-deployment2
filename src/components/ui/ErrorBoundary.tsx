'use client';

import { Component, type ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  module?: string;
}
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    logger.error('error_boundary_caught', error, {
      module:          this.props.module ?? 'unknown',
      componentStack: info.componentStack?.slice(0, 500),
    });
  }

  handleRetry = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div style={{
        background: 'rgba(255,82,82,.06)', border: '1px solid rgba(255,82,82,.2)',
        borderRadius: 14, padding: 32, textAlign: 'center', margin: '20px 0',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, color: '#ff8080', marginBottom: 8 }}>
          Module Error
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
          {this.state.error?.message ?? 'Something went wrong in this module.'}
        </div>
        <button
          onClick={this.handleRetry}
          style={{ padding: '8px 20px', borderRadius: 8, background: 'rgba(255,82,82,.15)', border: '1px solid rgba(255,82,82,.3)', color: '#ff8080', fontFamily: "'Orbitron',sans-serif", fontSize: 11, cursor: 'pointer' }}
        >
          <i className="fas fa-redo" style={{ marginRight: 6 }} />Retry
        </button>
        {process.env.NODE_ENV === 'development' && (
          <details style={{ marginTop: 16, textAlign: 'left', fontSize: 11, color: 'rgba(255,255,255,.25)', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            <summary style={{ cursor: 'pointer', marginBottom: 6 }}>Stack trace</summary>
            {this.state.error?.stack}
          </details>
        )}
      </div>
    );
  }
}

// ── Module-level error display (non-crashing) ─────────────────
export function ModuleError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div style={{ background: 'rgba(255,82,82,.06)', border: '1px solid rgba(255,82,82,.2)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <i className="fas fa-exclamation-triangle" style={{ color: '#ff8080', fontSize: 16, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: '#ff8080', flex: 1 }}>{message}</span>
      {onRetry && (
        <button onClick={onRetry} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.4)', cursor: 'pointer', fontSize: 12 }}>
          Retry
        </button>
      )}
    </div>
  );
}

// ── Plan gate error display ───────────────────────────────────
export function PlanGateError({ plan, feature }: { plan: string; feature: string }) {
  return (
    <div style={{ background: 'rgba(255,215,0,.06)', border: '1px solid rgba(255,215,0,.2)', borderRadius: 14, padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
      <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 14, color: '#ffd700', marginBottom: 8 }}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Required
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', marginBottom: 20 }}>
        {feature} requires the {plan} plan.
      </div>
      <a href="/dashboard/settings" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 20px', borderRadius: 9, background: 'linear-gradient(135deg,#ffd700,#daa520)', color: '#000', fontFamily: "'Orbitron',sans-serif", fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
        <i className="fas fa-crown" /> Upgrade Now
      </a>
    </div>
  );
}
