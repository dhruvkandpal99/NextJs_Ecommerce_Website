import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("🟢 Authorize function called with:", credentials); // DEBUG LOG
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          if (email === 'admin@example.com' && password === 'password123') {
            // Return the user object
            console.log("✅ Credentials matched!"); // DEBUG LOG
            return {
              id: '1',
              name: 'Admin User',
              email: 'admin@example.com',
            };
          }
        }
        console.log("❌ Credentials failed or invalid format"); // DEBUG LOG
        return null;
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      // Initially, the user object is available only on the first call
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the ID from the token to the session
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});