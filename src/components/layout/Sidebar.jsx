import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  FlaskConical,
  Lightbulb,
  BookOpen,
  BriefcaseBusiness,
  Store,
  Handshake,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
} from "lucide-react";

const menuSections = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
        end: true,
      },
    ],
  },
  {
    title: "People & Organisations",
    items: [
      {
        name: "People",
        path: "/people",
        icon: Users,
      },
      {
        name: "Organisations",
        path: "/organisations",
        icon: Building2,
      },
      {
        name: "Organisation Reviews",
        path: "/organisation-reviews",
        icon: ShieldCheck,
      },
      {
        name: "Partnerships",
        path: "/partnerships",
        icon: Handshake,
      },
    ],
  },
  {
    title: "Ecosystem",
    items: [
      {
        name: "Projects",
        path: "/projects",
        icon: FolderKanban,
      },
      {
        name: "Research",
        path: "/research",
        icon: FlaskConical,
      },
      {
        name: "Innovations",
        path: "/innovations",
        icon: Lightbulb,
      },
      {
        name: "Knowledge",
        path: "/knowledge",
        icon: BookOpen,
      },
      {
        name: "Opportunities",
        path: "/opportunities",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    title: "Marketplace & Impact",
    items: [
      {
        name: "Marketplace",
        path: "/marketplace",
        icon: Store,
      },
      {
        name: "Impact",
        path: "/impact",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        name: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar({
  collapsed = false,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}) {
  const closeMobileSidebar = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          bg-[#073B4C]
          text-white
          border-r border-white/10
          transition-all duration-300

          ${
            collapsed
              ? "lg:w-[88px]"
              : "lg:w-[270px]"
          }

          w-[280px]

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Brand */}
        <div
          className={`
            h-20
            flex items-center
            border-b border-white/10
            px-5
            shrink-0

            ${
              collapsed
                ? "lg:justify-center"
                : "justify-between"
            }
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo */}
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="font-extrabold text-[#073B4C] text-lg">
                I
              </span>
            </div>

            <div
              className={`
                min-w-0
                ${
                  collapsed
                    ? "lg:hidden"
                    : ""
                }
              `}
            >
              <h1 className="font-bold text-base leading-tight truncate">
                IGATI
              </h1>

              <p className="text-[11px] text-white/60 mt-0.5 truncate">
                Admin Portal
              </p>
            </div>
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X size={19} />
          </button>
        </div>

        {/* Admin label */}
        <div
          className={`
            px-5 pt-5
            ${
              collapsed
                ? "lg:px-3"
                : ""
            }
          `}
        >
          <div
            className={`
              rounded-2xl
              bg-white/10
              border border-white/10
              p-3
              flex items-center gap-3

              ${
                collapsed
                  ? "lg:justify-center"
                  : ""
              }
            `}
          >
            <div className="w-9 h-9 rounded-xl bg-[#F2B632] flex items-center justify-center shrink-0">
              <ShieldCheck
                size={18}
                className="text-[#073B4C]"
              />
            </div>

            <div
              className={
                collapsed
                  ? "lg:hidden"
                  : ""
              }
            >
              <p className="text-xs text-white/50">
                Administration
              </p>

              <p className="text-sm font-semibold">
                Ecosystem Management
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 sidebar-scrollbar">
          <div className="space-y-6">
            {menuSections.map(
              (section) => (
                <div key={section.title}>
                  {/* Section title */}
                  <p
                    className={`
                      px-3 mb-2
                      text-[10px]
                      uppercase
                      tracking-[0.16em]
                      font-bold
                      text-white/35

                      ${
                        collapsed
                          ? "lg:hidden"
                          : ""
                      }
                    `}
                  >
                    {section.title}
                  </p>

                  <div className="space-y-1">
                    {section.items.map(
                      (item) => (
                        <SidebarLink
                          key={item.path}
                          item={item}
                          collapsed={
                            collapsed
                          }
                          onClick={
                            closeMobileSidebar
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-3 shrink-0">
          {/* Collapse button */}
          <button
            type="button"
            onClick={() =>
              setCollapsed?.(
                !collapsed
              )
            }
            className={`
              hidden lg:flex
              w-full
              items-center
              rounded-xl
              text-white/60
              hover:text-white
              hover:bg-white/10
              transition
              py-2.5

              ${
                collapsed
                  ? "justify-center px-2"
                  : "justify-between px-3"
              }
            `}
          >
            {!collapsed && (
              <span className="text-sm font-medium">
                Collapse sidebar
              </span>
            )}

            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>

          {/* Footer */}
          {!collapsed && (
            <div className="hidden lg:block mt-3 px-3 pb-2">
              <p className="text-[10px] leading-5 text-white/30">
                IGATI Global Mission Network
              </p>

              <p className="text-[10px] text-white/20">
                Administration Portal
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  item,
  collapsed,
  onClick,
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onClick}
      title={
        collapsed
          ? item.name
          : undefined
      }
      className={({ isActive }) =>
        `
          relative
          flex items-center
          rounded-xl
          transition-all duration-200
          group

          ${
            collapsed
              ? "lg:justify-center lg:px-2"
              : ""
          }

          px-3 py-2.5

          ${
            isActive
              ? "bg-white text-[#073B4C] shadow-sm"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }
        `
      }
    >
      {({ isActive }) => (
        <>
          {/* Active marker */}
          {isActive && (
            <span
              className={`
                absolute
                left-0
                w-1
                h-6
                rounded-r-full
                bg-[#F2B632]

                ${
                  collapsed
                    ? "lg:hidden"
                    : ""
                }
              `}
            />
          )}

          <Icon
            size={19}
            strokeWidth={
              isActive ? 2.4 : 2
            }
            className="shrink-0"
          />

          <span
            className={`
              ml-3
              text-sm
              font-medium
              whitespace-nowrap

              ${
                collapsed
                  ? "lg:hidden"
                  : ""
              }
            `}
          >
            {item.name}
          </span>

          {/* Tooltip when collapsed */}
          {collapsed && (
            <div
              className="
                hidden
                lg:group-hover:block
                absolute
                left-[70px]
                top-1/2
                -translate-y-1/2
                z-[100]
                bg-slate-900
                text-white
                text-xs
                font-medium
                px-3
                py-2
                rounded-lg
                shadow-xl
                whitespace-nowrap
                pointer-events-none
              "
            >
              {item.name}

              <span
                className="
                  absolute
                  top-1/2
                  -left-1
                  -translate-y-1/2
                  w-2
                  h-2
                  rotate-45
                  bg-slate-900
                "
              />
            </div>
          )}
        </>
      )}
    </NavLink>
  );
}