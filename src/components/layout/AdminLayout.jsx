import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  // Temporary admin data.
  // Later replace this with data from:
  // GET /api/auth/me/
  const admin = {
    full_name: "Administrator",
    email: "admin@igatikenya.org",
    role: "admin",
    profile_image: "",
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7]">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main area */}
      <div
        className={`
          min-h-screen
          transition-all
          duration-300

          ${
            collapsed
              ? "lg:ml-[88px]"
              : "lg:ml-[270px]"
          }
        `}
      >
        {/* Topbar */}
        <Topbar
          setMobileOpen={
            setMobileOpen
          }
          admin={admin}
          notificationCount={3}
          onLogout={handleLogout}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}