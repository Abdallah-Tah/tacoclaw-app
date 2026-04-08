import React, { useEffect, useState } from 'react';
import { useDashboardStore } from '../../store/useDashboardStore';

export const WinLossFlash: React.FC = () => {
  const flashEvent = useDashboardStore((state) => state.flashEvent);
  const [show, setShow] = useState(false);
  const [type, setType] = useState<'win' | 'loss'>('win');

  useEffect(() => {
    if (flashEvent) {
      setType(flashEvent);
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [flashEvent]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[100] transition-opacity duration-700 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: type === 'win'
          ? 'radial-gradient(ellipse at center, rgba(34,197,94,0.15) 0%, transparent 70%)'
          : 'radial-gradient(ellipse at center, rgba(239,68,68,0.15) 0%, transparent 70%)',
      }}
    >
      <div className={`absolute top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-bold text-lg tracking-wider animate-bounce ${
        type === 'win'
          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]'
          : 'bg-rose-500/20 border border-rose-500/40 text-rose-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
      }`}>
        {type === 'win' ? 'WIN!' : 'LOSS'}
      </div>
    </div>
  );
};