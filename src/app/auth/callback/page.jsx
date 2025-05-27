'use client';

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGlobalContext } from "@/component/Context";
import LoadingSpinner from "@/component/LoadingSpinner/LoadingSpinner";

export default function CallbackPage() {
  const {refHostId} = useGlobalContext();
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
            refId: refHostId,
            provider: "google",
          }),
        });

        const data = await res.json();
        if (data.success) {
          const finalUserData = data.finalUserData
          const now = new Date().getTime();
          const userDataWithTimestamp = { ...finalUserData, timestamp: now };
          localStorage.setItem("userData", JSON.stringify(userDataWithTimestamp));
          window.location.reload();
        }
        else{
          window.location.pathname = "/"
        }
      }
    };

    registerGoogleUser();
  }, [session]);

  return <div>
    <LoadingSpinner />
    </div>;
}
