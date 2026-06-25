'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loanRequestSchema } from '@/lib/validations/financial.schema';

type FormData = z.infer<typeof loanRequestSchema>;

export function LoanApplicationForm({ subscriberId }: { subscriberId: string }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(loanRequestSchema),
    defaultValues: { subscriberId, amount: 25000, termWeeks: 4 }
  });

  async function onSubmit(data: FormData) {
    const res = await fetch('/api/financial/loan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'Loan request failed');
    alert(json.eligible ? 'Loan approved and disbursed.' : 'Loan rejected by CDWM eligibility rules.');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input type="hidden" {...register('subscriberId')} />
      <Input type="number" {...register('amount', { valueAsNumber: true })} />
      <Input type="number" {...register('termWeeks', { valueAsNumber: true })} />
      <Button disabled={isSubmitting} className="w-full">Apply now</Button>
    </form>
  );
}
