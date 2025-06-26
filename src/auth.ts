import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { createSession } from './app/lib/session';
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user) {
        await createSession(user);
      }
      return true;
    }
  }
});