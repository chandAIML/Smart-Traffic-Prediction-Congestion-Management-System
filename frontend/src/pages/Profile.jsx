import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Layout from "../components/admin/Layout";
import OperatorSidebar from "../components/OperatorSidebar";

const roleLabels = { admin: "Administrator", operator: "Operator", commuter: "Commuter" };
const roleHome = { admin: "/admin", operator: "/operator", commuter: "/commuter" };

function ProfileContent({ username, role, email, onBack }) {
  useEffect(() => {
    if (window.location.hash === "#settings") {
      document.getElementById("settings")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <main className="profile-page">
      <button
        type="button"
        className="profile-back-btn"
        onClick={onBack}
        style={{
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#eef6ff",
          padding: "8px 14px",
          borderRadius: "10px",
          cursor: "pointer",
          fontSize: "13px",
        }}
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <section className="profile-card">
        <p className="profile-eyebrow">TrafficVision AI</p>
        <h1>{username}</h1>
        <p>{roleLabels[role] || role}</p>
        <span>{email}</span>
      </section>

      <section id="settings" className="profile-card profile-settings">
        <p className="profile-eyebrow">Settings</p>
        <h2>Account Preferences</h2>
        <p>Email: {email}</p>
        <p>Role: {roleLabels[role] || role}</p>
      </section>
    </main>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const rawUsername = localStorage.getItem("username") || "User";
  const username = rawUsername.replace(/\s*\([^)]*\)/g, "").trim();
  const role = localStorage.getItem("role") || "commuter";
  const email = localStorage.getItem("email") || "Not available";

  const goBack = () => navigate(roleHome[role] || "/");
  const content = <ProfileContent username={username} role={role} email={email} onBack={goBack} />;

  // Same role-aware layout pattern used on Alerts.jsx / Prediction.jsx,
  // so the sidebar/topbar (and a way back home) is always visible here too.
  if (role === "admin") {
    return <Layout>{content}</Layout>;
  }

  if (role === "operator") {
    return (
      <div className="operator-layout">
        <OperatorSidebar />
        <div
          className="operator-dashboard operator-page-content animate-fade-in"
          style={{ width: "100%", minHeight: "100vh" }}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
}
