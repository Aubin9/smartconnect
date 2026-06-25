'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export function SwipeableCard({ children }: { children: ReactNode }) {
  return (
    <motion.div drag="x" dragConstraints={{ left: -80, right: 0 }} whileTap={{ scale: 0.98 }}>
      <Card>{children}</Card>
    </motion.div>
  );
}
