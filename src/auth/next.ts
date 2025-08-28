import { AUTH_CONFIG, GOOGLE_BASIC_SCOPES } from '@/constants/authConstants';
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
    error?: 'RefreshAccessTokenError' | 'TokenExpiredError' | 'InvalidTokenError';
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: GOOGLE_BASIC_SCOPES,
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

function isTokenExpired(tokenExpiresAt?: number): boolean {
  if (!tokenExpiresAt || tokenExpiresAt <= 0) {
    return true;
  }
  return tokenExpiresAt <= Date.now() + AUTH_CONFIG.TOKEN_REFRESH_BUFFER;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    console.error('No refresh token available');
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID!,
        client_secret: process.env.AUTH_GOOGLE_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error('Token refresh failed:', {
        status: response.status,
        statusText: response.statusText,
        error: refreshedTokens
      });
      throw new Error(`Token refresh failed: ${refreshedTokens.error_description || refreshedTokens.error}`);
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + (refreshedTokens.expires_in * 1000),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}