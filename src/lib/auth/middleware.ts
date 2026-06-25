import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './config';

export async function requireSession(roles?: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  if (roles?.length && !roles.includes(session.user.role)) redirect('/mobile');
  return session;
}
