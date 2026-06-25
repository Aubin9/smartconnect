'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BottomSheet({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/40 md:hidden" onClick={onClose}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        onClick={(event) => event.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-soft dark:bg-slate-950"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
