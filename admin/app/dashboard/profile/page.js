"use client";

import { PageHeader } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-val">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { admin } = useAuth();

  const name = admin?.name || "Administrator";
  const email = admin?.email || "admin@majedar.com";
  const role = admin?.role === "admin" ? "Super Administrator" : "Administrator";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <PageHeader
        title="Admin Profile"
      />

      <div className="profile-layout">
        {/* Main profile */}
        <section className="surface form-panel">
        <div style={{ marginTop: 20 }}>
            <InfoRow label="Full Name" value={name} />
            <InfoRow label="Email Address" value={email} />
            <InfoRow label="Account Role" value={role} />
          </div>
        </section>
      </div>
    </>
  );
}