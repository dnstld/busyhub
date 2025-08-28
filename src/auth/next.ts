import { AUTH_CONFIG } from '@/constants/auth-constants';
import { isTokenExpired, refreshAccessToken, TokenError } from '@/utils/token-utils';
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Google from 'next-auth/providers/google';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: TokenError;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent',
          response_type: 'code',
          hl: 'en'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : 0,
          name: user.name,
          email: user.email,
          picture: user.image,
          error: undefined,
        };
      }

      if (!isTokenExpired(token.accessTokenExpires)) {
        return token;
      }
      
      try {
        const refreshedToken = await refreshAccessToken(token as JWT);
        return refreshedToken;
      } catch (error) {
        console.error('JWT callback error during token refresh:', error);
        return {
          ...token,
          error: 'RefreshAccessTokenError',
        };
      }
    },

    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }

      if (token.error) {
        session.error = token.error;
        if (process.env.NODE_ENV === 'development') {
          console.log('Session contains error:', { error: token.error });
        }
      }

      return session;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: AUTH_CONFIG.SESSION_MAX_AGE,
    updateAge: AUTH_CONFIG.SESSION_UPDATE_AGE,
  },

  pages: {
    signIn: '/',
  },

  debug: process.env.NODE_ENV === 'development'
});