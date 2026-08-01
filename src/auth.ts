import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const baseAdapter = PrismaAdapter(prisma);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: {
    ...baseAdapter,
    createUser: async (data) => {
      const usernameBase = data.email?.split("@")[0] || "user";
      let username = usernameBase;
      let suffix = 1;

      while (await prisma.user.findUnique({ where: { username } })) {
        username = `${usernameBase}${suffix}`;
        suffix++;
      }

      return prisma.user.create({
        data: { ...data, username },
      });
    },
  },
  providers: [GitHub, Google],
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.username = user.username;
      }
      return session;
    },
  },
});
