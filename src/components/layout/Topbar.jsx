import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";

const pageTitles = {
  "/": {
    title: "Dashboard",
    description: "Overview of the IGATI ecosystem.",
  },

  "/people": {
    title: "People",
    description: "Manage ecosystem members and profiles.",
  },

  "/organisations": {
    title: "Organisations",
    description: "Manage registered organisations.",
  },

  "/organisation-reviews": {
    title: "Organisation Reviews",
    description: "Review and approve organisation applications.",
  },

  "/partnerships": {
    title: "Partnerships",
    description: "Manage partnership and collaboration requests.",
  },

  "/projects": {
    title: "Projects",
    description: "Manage ecosystem projects.",
  },

  "/research": {
    title: "Research",
    description: "Manage research records and activities.",
  },

  "/innovations": {
    title: "Innovations",
    description: "Manage ecosystem innovations.",
  },

  "/knowledge": {
    title: "Knowledge",
    description: "Manage knowledge outputs and resources.",
  },

  "/opportunities": {
    title: "Opportunities",
    description: "Manage opportunities across the ecosystem.",
  },

  "/marketplace": {
    title: "Marketplace",
    description: "Manage marketplace activity and listings.",
  },

  "/impact": {
    title: "Impact",
    description: "Review ecosystem impact records.",
  },

  "/settings": {
    title: "Settings",
    description: "Manage system and account settings.",
  },
};

export default function Topbar({
  setMobileOpen,
  admin = null,
  notificationCount = 0,
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const profileRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const getCurrentPage = () => {
    const pathname =
      location.pathname;

    if (
      pageTitles[pathname]
    ) {
      return pageTitles[pathname];
    }

    if (
      pathname.startsWith(
        "/organisations/"
      )
    ) {
      return {
        title: "Organisation",
        description:
          "View and manage organisation information.",
      };
    }

    if (
      pathname.startsWith(
        "/people/"
      )
    ) {
      return {
        title: "Person Profile",
        description:
          "View ecosystem member information.",
      };
    }

    if (
      pathname.startsWith(
        "/projects/"
      )
    ) {
      return {
        title: "Project",
        description:
          "View and manage project information.",
      };
    }

    return {
      title: "IGATI Admin",
      description:
        "IGATI Global Mission Network Administration.",
    };
  };

  const currentPage =
    getCurrentPage();

  const adminName =
    admin?.full_name ||
    admin?.username ||
    "Administrator";

  const adminRole =
    admin?.role === "admin"
      ? "Administrator"
      : admin?.role === "staff"
      ? "Staff"
      : "Administrator";

  const initials =
    getInitials(adminName);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      return;
    }

    navigate(
      `/search?q=${encodeURIComponent(
        search.trim()
      )}`
    );

    setSearchOpen(false);
  };

  const handleLogout = () => {
    setProfileOpen(false);

    if (onLogout) {
      onLogout();
      return;
    }

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/");
  };

  return (
    <>
      <header
        className="
          sticky
          top-0
          z-30
          h-20
          bg-white/95
          backdrop-blur-xl
          border-b
          border-slate-200
        "
      >
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-4 min-w-0">

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() =>
                setMobileOpen?.(true)
              }
              className="
                lg:hidden
                w-10
                h-10
                rounded-xl
                border
                border-slate-200
                bg-white
                flex
                items-center
                justify-center
                text-slate-600
                hover:text-[#07505E]
                hover:bg-slate-50
                transition
                shrink-0
              "
            >
              <Menu size={20} />
            </button>

            {/* Page title */}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-[#073B4C] truncate">
                {currentPage.title}
              </h1>

              <p className="hidden sm:block mt-0.5 text-xs sm:text-sm text-slate-500 truncate">
                {
                  currentPage.description
                }
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Desktop search */}
            <form
              onSubmit={handleSearch}
              className="hidden xl:block relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search ecosystem..."
                className="
                  w-[270px]
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-11
                  pr-4
                  py-2.5
                  text-sm
                  outline-none
                  transition
                  focus:bg-white
                  focus:border-[#07505E]
                  focus:ring-4
                  focus:ring-[#07505E]/10
                "
              />
            </form>

            {/* Mobile/tablet search */}
            <button
              type="button"
              onClick={() =>
                setSearchOpen(true)
              }
              className="
                xl:hidden
                w-10
                h-10
                rounded-xl
                border
                border-slate-200
                flex
                items-center
                justify-center
                text-slate-500
                hover:text-[#07505E]
                hover:bg-slate-50
                transition
              "
            >
              <Search size={18} />
            </button>

            {/* Notifications */}
            <button
              type="button"
              onClick={() =>
                navigate(
                  "/notifications"
                )
              }
              className="
                relative
                w-10
                h-10
                rounded-xl
                border
                border-slate-200
                flex
                items-center
                justify-center
                text-slate-500
                hover:text-[#07505E]
                hover:bg-slate-50
                transition
              "
            >
              <Bell size={18} />

              {notificationCount > 0 && (
                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-[18px]
                    h-[18px]
                    px-1
                    rounded-full
                    bg-[#F2B632]
                    text-[#073B4C]
                    text-[10px]
                    font-bold
                    flex
                    items-center
                    justify-center
                    border-2
                    border-white
                  "
                >
                  {notificationCount > 99
                    ? "99+"
                    : notificationCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <div
              ref={profileRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  hover:bg-slate-50
                  transition
                  p-1.5
                  sm:pr-3
                "
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-[#073B4C] overflow-hidden flex items-center justify-center shrink-0">
                  {admin?.profile_image ? (
                    <img
                      src={
                        admin.profile_image
                      }
                      alt={adminName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-white">
                      {initials}
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="hidden md:block text-left min-w-0">
                  <p className="max-w-[150px] truncate text-sm font-semibold text-slate-800">
                    {adminName}
                  </p>

                  <p className="text-xs text-slate-400">
                    {adminRole}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`
                    hidden
                    md:block
                    text-slate-400
                    transition-transform
                    ${
                      profileOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div
                  className="
                    absolute
                    right-0
                    mt-3
                    w-[260px]
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-xl
                    overflow-hidden
                    z-50
                  "
                >
                  {/* User info */}
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#073B4C] overflow-hidden flex items-center justify-center shrink-0">
                        {admin?.profile_image ? (
                          <img
                            src={
                              admin.profile_image
                            }
                            alt={
                              adminName
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-white">
                            {initials}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {adminName}
                        </p>

                        <p className="text-xs text-slate-500 truncate">
                          {admin?.email ||
                            "IGATI Administration"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#07505E]/10 px-2.5 py-1 text-xs font-semibold text-[#07505E]">
                      <ShieldCheck size={13} />
                      {adminRole}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="p-2">
                    <DropdownItem
                      icon={User}
                      label="My Profile"
                      onClick={() => {
                        setProfileOpen(
                          false
                        );
                        navigate(
                          "/profile"
                        );
                      }}
                    />

                    <DropdownItem
                      icon={Settings}
                      label="Settings"
                      onClick={() => {
                        setProfileOpen(
                          false
                        );
                        navigate(
                          "/settings"
                        );
                      }}
                    />
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-100 p-2">
                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2.5
                        text-sm
                        font-medium
                        text-red-600
                        hover:bg-red-50
                        transition
                      "
                    >
                      <LogOut size={17} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-start justify-center p-4 pt-24 xl:hidden">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#073B4C]">
                  Search IGATI
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Search people,
                  organisations,
                  projects and ecosystem
                  resources.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSearchOpen(false)
                }
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            <form
              onSubmit={handleSearch}
              className="p-5"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    pl-12
                    pr-4
                    py-3.5
                    outline-none
                    focus:border-[#07505E]
                    focus:ring-4
                    focus:ring-[#07505E]/10
                  "
                />
              </div>

              <button
                type="submit"
                className="
                  mt-4
                  w-full
                  rounded-xl
                  bg-[#07505E]
                  text-white
                  font-semibold
                  py-3
                  hover:bg-[#073B4C]
                  transition
                "
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function DropdownItem({
  icon: Icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-2.5
        text-sm
        font-medium
        text-slate-600
        hover:text-[#07505E]
        hover:bg-slate-50
        transition
      "
    >
      <Icon size={17} />
      {label}
    </button>
  );
}

function getInitials(name) {
  if (!name) return "A";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");
}