'use client';

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function CallbackPage() {
  const { data: session } = useSession();

  useEffect(() => {
    const registerGoogleUser = async () => {
      if (session?.user) {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: session.user.name,
            email: session.user.email,
            number: "",
            password: "not set",
            provider: "google",
          }),
        });
        const data = await res.json();
        const finalUserData = data.finalUserData
        const now = new Date().getTime();
        const userDataWithTimestamp = { ...finalUserData, timestamp: now };
        localStorage.setItem("userData", JSON.stringify(userDataWithTimestamp));
        window.location.reload();
      }
    };

    registerGoogleUser();
  }, [session]);

  return <p>Setting things up...</p>;
}
