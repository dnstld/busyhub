import { deleteSession } from '@/app/lib/session';
import { signIn, signOut } from '@/auth';
 
export async function logout() {
  'use server';

  await deleteSession();
  await signOut({
    redirectTo: '/',
  });
}

export async function login() {
  'use server';

  await signIn('google', {
    redirectTo: '/dashboard',
  });
}