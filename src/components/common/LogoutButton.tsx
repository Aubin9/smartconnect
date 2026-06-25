'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function LogoutButton({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="md"
      className={className}
      onClick={() => signOut({ callbackUrl: '/' })}
      aria-label="Log out of SmartConnect"
    >
      <LogOut className="h-4 w-4" />
      {!compact && <span>Logout</span>}
    </Button>
  );
}
