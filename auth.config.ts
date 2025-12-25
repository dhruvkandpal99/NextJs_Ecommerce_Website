import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // Redirect here if not logged in
  },
  providers: [], // Configured in auth.ts to avoid Edge issues
  callbacks: {
    // This 'authorized' callback acts as your Middleware protection
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminPage = nextUrl.pathname.startsWith('/admin');

      if (isAdminPage) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }
      
      return true; // Allow access to other pages
    },
  },
} satisfies NextAuthConfig;