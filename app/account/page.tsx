"use client";

import { useEffect, useState } from "react";
import { getCustomerProfile, type CustomerProfile } from "@/src/services/customer";
import { useAuth } from "@/src/context/AuthContext";

export default function AccountPage() {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

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

  return (
    <main className="min-h-screen w-full px-6 py-12">
      <section className="mx-auto w-full max-w-xl space-y-4 bg-card p-6">
        <h1 className="text-lg font-semibold uppercase tracking-[0.2em] text-foreground">
          Account
        </h1>
        {profile ? (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Name: {profile.firstName} {profile.lastName}
            </p>
            <p>Email: {profile.email}</p>
            <p>Display name: {profile.displayName}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Please log in to view your account details.
          </p>
        )}
      </section>
    </main>
  );
}
