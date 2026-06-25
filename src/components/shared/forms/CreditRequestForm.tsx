'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { creditRequestSchema } from '@/lib/validations/financial.schema';

type FormData = z.infer<typeof creditRequestSchema>;

export function CreditRequestForm({ subscriberId }: { subscriberId: string }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(creditRequestSchema),
    defaultValues: { subscriberId, amount: 100, reason: 'Manual PNQM compensation' }
  });

  async function onSubmit(data: FormData) {
    const res = await fetch('/api/financial/credit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error('Credit request failed');
    alert('Credit applied successfully');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input type="hidden" {...register('subscriberId')} />
      <Input type="number" step="1" {...register('amount', { valueAsNumber: true })} />
      {errors.amount && <p className="text-xs text-red-600">{errors.amount.message}</p>}
      <Input {...register('reason')} />
      <Button disabled={isSubmitting} className="w-full">Apply credit</Button>
    </form>
  );
}
