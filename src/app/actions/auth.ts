import { signIn, signOut } from '@/lib/auth';

export async function logout() {
  'use server';
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