import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          // Optional: get referral ID from cookie or pass a dummy one
          const refId = ""; // You can customize this

          await fetch(`${process.env.NEXTAUTH_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              number: "",
              password: "not set",
              refId: refId,
              provider: "google" 
            }),
          });
        } catch (err) {
          console.error("Error registering Google user:", err);
        }
      }

      return true;
    },

    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
