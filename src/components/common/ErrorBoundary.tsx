'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type State = { hasError: boolean; message: string };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('SmartConnect UI error', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <Card className="mx-auto mt-10 max-w-xl text-center">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Something went wrong</h2>
        <p className="mt-2 text-sm text-slate-500">{this.state.message || 'The dashboard failed to render.'}</p>
        <Button className="mt-5" onClick={() => this.setState({ hasError: false, message: '' })}>Retry</Button>
      </Card>
    );
  }
}
