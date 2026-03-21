'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';

export default function Toast() {
  const { toast, clearToast } = useUIStore();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3200);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  return (
    <div className={`ff-toast ${toast ? 'show' : ''} ${toast?.type ?? ''}`}>
      {toast?.message}
    </div>
  );
}
