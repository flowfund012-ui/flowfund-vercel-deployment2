'use client';

import { useEffect } from 'react';

interface ModalProps {
  title: string;
  icon?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: number;
}

export default function Modal({ title, icon, onClose, children, maxWidth = 480 }: ModalProps) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="ff-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ff-modal" style={{ maxWidth }}>
        <div className="ff-modal-hdr">
          <span className="ff-modal-title">
            {icon && <i className={`fas ${icon}`} style={{ marginRight: 8 }} />}
            {title}
          </span>
          <button className="ff-modal-x" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
