import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: "daurin-local-development-secret-key-2026",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Gunakan 'industri@...', 'pengepul@...', dll" },
        password: { label: "Password", type: "password", placeholder: "Sembarang password (Mock Mode)" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // MOCK MODE: Bypass DB entirely and grant access based on email keyword
        let role = "RUMAH_TANGGA";
        let name = "Budi (Warga)";

        if (credentials.email.toLowerCase().includes("pengepul")) {
          role = "PENGEPUL";
          name = "Pengepul Berkah";
        } else if (credentials.email.toLowerCase().includes("industri")) {
          role = "INDUSTRI";
          name = "PT Daur Ulang Plastik";
        } else if (credentials.email.toLowerCase().includes("admin")) {
          role = "ADMIN";
          name = "Admin Daurin";
        }

        return {
          id: `mock-id-${Date.now()}`,
          email: credentials.email,
          name: name,
          role: role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
};
