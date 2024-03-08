import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import github from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const credentialsConfig = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: {
      label: "User Email",
    },
    password: {
      label: "Password",
      type: "password",
    },
  },
  async authorize(credentials) {
    if (credentials.email === "sk@gmail.com" && credentials.password === "123")
      return {
        name: "Jona",
        email: "j@example.com",
        color: "red",
      };
    else return null;
  },
});

export const config = {
  providers: [Google, credentialsConfig, github],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ request, auth }) {
      const nextUrl = request.nextUrl;
      const { pathname } = nextUrl;
      const isLoggedIn = !!auth;

      if (pathname.startsWith("/lock")) {
        return isLoggedIn;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
