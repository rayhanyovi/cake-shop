"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCustomerProfile,
  type CustomerProfile,
} from "@/src/services/customer";
import { useAuth } from "@/src/context/AuthContext";

export default function AccountPage() {
  const { accessToken, clearAuth } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    const loadProfile = async () => {
      try {
        const response = await getCustomerProfile(accessToken);
        setProfile(response?.data ?? null);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    loadProfile();
  }, [accessToken]);

  const canLogout = Boolean(accessToken);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
      clearAuth();
      setProfile(null);
      setIsLoggingOut(false);
      router.push("/home");
    }
  };

  return (
    <main className="min-h-screen w-full px-5 md:px-8 py-12">
      <section className="mx-auto w-full bg-card p-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h1 className="text-lg font-semibold uppercase tracking-[0.2em] text-foreground">
              Account
            </h1>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            {profile ? (
              <>
                <p>
                  Name: {profile.firstName} {profile.lastName}
                </p>
                <p>Email: {profile.email}</p>
                <p>Display name: {profile.displayName}</p>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="mt-4 w-fit bg-[#556B2F] px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </button>
              </>
            ) : (
              <>
                <p>Please log in to view your account details.</p>
                {canLogout ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="mt-4 w-fit bg-[#556B2F] px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </button>
                ) : null}
              </>
            )}
          </div>
          <div />
        </div>
      </section>
    </main>
  );
}
