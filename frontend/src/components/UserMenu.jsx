import { ChevronDown, LogOut, Settings, ShieldCheck, UserCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const roleLabels = { admin: "Administrator", operator: "Operator", commuter: "Commuter" };
const switchLabels = {
  admin: ["Login as Operator", "Login as User"],
  operator: ["Login as Admin", "Login as User"],
  commuter: ["Login as Admin", "Login as Operator"]
};

export default function UserMenu() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const rawUsername = localStorage.getItem("username") || "User";
  const username = rawUsername.replace(/\s*\([^)]*\)/g, "").trim();
  const role = localStorage.getItem("role") || "commuter";

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const closeAndNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  const logout = () => {
    setOpen(false);
    ["token", "role", "username", "email"].forEach((key) => localStorage.removeItem(key));
    navigate("/", { replace: true });
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="profile user-menu-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserCircle2 size={42} />
        <div><h4>{username}</h4><span>{roleLabels[role] || role}</span></div>
        <ChevronDown size={18} className={open ? "chevron-open" : ""} />
      </button>
      {open && (
        <div className="user-dropdown" role="menu">
          <div className="dropdown-header">
            <UserCircle2 size={28} />
            <div>
              <strong>{username}</strong>
              <span>{roleLabels[role] || role}</span>
            </div>
          </div>
          <div className="dropdown-divider" />
          <button type="button" onClick={() => closeAndNavigate("/profile")}>
            <UserCircle2 size={16} />View Profile
          </button>
          <button type="button" className="settings-option" onClick={() => closeAndNavigate("/profile#settings")}>
            <Settings size={16} />Settings
          </button>
          <div className="dropdown-divider" />
          <div className="dropdown-label"><ShieldCheck size={14} />Switch role</div>
          {(switchLabels[role] || []).map((label) => (
            <button type="button" className="role-option" key={label} onClick={() => closeAndNavigate("/")}>
              {label}
            </button>
          ))}
          <div className="dropdown-divider" />
          <button type="button" className="logout-option" onClick={logout}>
            <LogOut size={16} />Logout
          </button>
        </div>
      )}
    </div>
  );
}
