import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Users,
  Building2,
  FolderKanban,
  FlaskConical,
  Lightbulb,
  BriefcaseBusiness,
  Store,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Clock3,
  MapPin,
  UserRound,
  Loader2,
  AlertCircle,
  RefreshCcw,
  CheckCircle2,
  BookOpen,
  TrendingUp,
} from "lucide-react";

import {
  adminApi,
} from "../api/adminApi";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await adminApi.dashboard();

      setDashboard(response);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardLoader />;
  }

  if (error && !dashboard) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="min-h-[500px] rounded-3xl border border-red-100 bg-white flex items-center justify-center">
          <div className="max-w-md text-center px-6 py-12">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Unable to load dashboard
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={loadDashboard}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#07505E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#073B4C] transition"
            >
              <RefreshCcw size={16} />

              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats =
    dashboard?.stats || {};

  const organisations =
    stats?.organisations || {};

  const people =
    stats?.people || {};

  const pendingOrganisations =
    dashboard
      ?.recent_pending_organisations ||
    [];

  const recentPeople =
    dashboard?.recent_people || [];

  const statCards = [
    {
      title: "People",
      value: people.total || 0,
      subtitle: `${
        people.verified || 0
      } verified`,
      icon: Users,
      path: "/people",
    },

    {
      title: "Organisations",
      value:
        organisations.total || 0,
      subtitle: `${
        organisations.approved || 0
      } approved`,
      icon: Building2,
      path: "/organisations",
    },

    {
      title: "Pending Reviews",
      value:
        organisations.pending || 0,
      subtitle:
        "Require admin review",
      icon: ShieldCheck,
      path:
        "/organisation-reviews",
      highlight: true,
    },

    {
      title: "Projects",
      value: stats.projects || 0,
      subtitle:
        "Ecosystem projects",
      icon: FolderKanban,
      path: "/projects",
    },

    {
      title: "Research",
      value: stats.research || 0,
      subtitle:
        "Research records",
      icon: FlaskConical,
      path: "/research",
    },

    {
      title: "Innovations",
      value:
        stats.innovations || 0,
      subtitle:
        "Innovation records",
      icon: Lightbulb,
      path: "/innovations",
    },

    {
      title: "Opportunities",
      value:
        stats.opportunities || 0,
      subtitle:
        "Ecosystem opportunities",
      icon: BriefcaseBusiness,
      path: "/opportunities",
    },

    {
      title: "Marketplace",
      value:
        stats.marketplace || 0,
      subtitle:
        "Marketplace listings",
      icon: Store,
      path: "/marketplace",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome */}
      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          bg-gradient-to-br
          from-[#073B4C]
          via-[#07505E]
          to-[#0A6773]
          px-6
          py-8
          md:px-8
          md:py-9
          text-white
        "
      >
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-[#6C994E]/20 blur-2xl" />

        <div className="absolute -bottom-28 left-1/3 w-72 h-72 rounded-full bg-[#F2B632]/10 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#F2B632]" />

              IGATI Administration
            </div>

            <h1 className="mt-5 text-2xl sm:text-3xl font-bold">
              Ecosystem Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm sm:text-base leading-7 text-white/70">
              Manage people,
              organisations, projects,
              research, innovation,
              opportunities, marketplace
              activity and ecosystem
              impact.
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                "/organisation-reviews"
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F2B632] px-5 py-3 text-sm font-bold text-[#073B4C] hover:bg-[#D99A16] transition shrink-0"
          >
            <ShieldCheck size={17} />

            Review Organisations

            {organisations.pending >
              0 && (
              <span className="ml-1 rounded-full bg-[#073B4C] px-2 py-0.5 text-[11px] text-white">
                {
                  organisations.pending
                }
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map(
            (card) => (
              <StatCard
                key={card.title}
                {...card}
                onClick={() =>
                  navigate(card.path)
                }
              />
            )
          )}
        </div>
      </section>

      {/* Secondary overview */}
      <section className="mt-7 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <MiniStat
          icon={BookOpen}
          label="Knowledge Outputs"
          value={
            stats.knowledge || 0
          }
          onClick={() =>
            navigate("/knowledge")
          }
        />

        <MiniStat
          icon={BarChart3}
          label="Impact Records"
          value={stats.impact || 0}
          onClick={() =>
            navigate("/impact")
          }
        />

        <MiniStat
          icon={CheckCircle2}
          label="Approved Organisations"
          value={
            organisations.approved ||
            0
          }
          onClick={() =>
            navigate(
              "/organisations"
            )
          }
        />
      </section>

      {/* Main tables */}
      <div className="mt-7 grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">

        {/* Pending organisations */}
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

          <SectionHeader
            title="Pending Organisation Reviews"
            description="Recently submitted organisations waiting for administrative review."
            icon={ShieldCheck}
            buttonLabel="View All"
            onClick={() =>
              navigate(
                "/organisation-reviews"
              )
            }
          />

          {pendingOrganisations.length ===
          0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No pending reviews"
              description="There are currently no organisations waiting for review."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingOrganisations.map(
                (organisation) => (
                  <PendingOrganisationRow
                    key={
                      organisation.id
                    }
                    organisation={
                      organisation
                    }
                    onClick={() =>
                      navigate(
                        `/organisation-reviews/${organisation.slug}`
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </section>

        {/* Recent people */}
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

          <SectionHeader
            title="Recent Members"
            description="Recently added people in the IGATI ecosystem."
            icon={Users}
            buttonLabel="View People"
            onClick={() =>
              navigate("/people")
            }
          />

          {recentPeople.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No members yet"
              description="Recent ecosystem members will appear here."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {recentPeople.map(
                (person) => (
                  <PersonRow
                    key={person.id}
                    person={person}
                    onClick={() =>
                      navigate(
                        `/people/${person.slug}`
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>

      {/* Organisation review summary */}
      <section className="mt-7 rounded-3xl border border-slate-200 bg-white shadow-sm p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>
            <h2 className="text-lg font-bold text-[#073B4C]">
              Organisation Review
              Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current organisation
              approval workflow status.
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                "/organisation-reviews"
              )
            }
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#07505E] hover:text-[#073B4C]"
          >
            Manage Reviews
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ReviewStatus
            label="Pending"
            value={
              organisations.pending ||
              0
            }
          />

          <ReviewStatus
            label="Approved"
            value={
              organisations.approved ||
              0
            }
          />

          <ReviewStatus
            label="Changes Requested"
            value={
              organisations.changes_requested ||
              0
            }
          />

          <ReviewStatus
            label="Rejected"
            value={
              organisations.rejected ||
              0
            }
          />
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-7">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#073B4C]">
              Quick Actions
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Frequently used
              administration tools.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          <QuickAction
            icon={ShieldCheck}
            title="Review Organisations"
            description="Approve, reject or request changes."
            onClick={() =>
              navigate(
                "/organisation-reviews"
              )
            }
          />

          <QuickAction
            icon={Users}
            title="Manage People"
            description="View ecosystem member profiles."
            onClick={() =>
              navigate("/people")
            }
          />

          <QuickAction
            icon={FolderKanban}
            title="Manage Projects"
            description="Review ecosystem projects and activities."
            onClick={() =>
              navigate("/projects")
            }
          />

          <QuickAction
            icon={Store}
            title="Marketplace"
            description="Review marketplace listings and activity."
            onClick={() =>
              navigate(
                "/marketplace"
              )
            }
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  onClick,
  highlight,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        text-left
        rounded-2xl
        border
        p-5
        transition
        shadow-sm

        ${
          highlight
            ? "border-[#F2B632]/40 bg-[#F2B632]/5 hover:bg-[#F2B632]/10"
            : "border-slate-200 bg-white hover:border-[#07505E]/30 hover:shadow-md"
        }
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`
            w-11
            h-11
            rounded-xl
            flex
            items-center
            justify-center

            ${
              highlight
                ? "bg-[#F2B632]/20"
                : "bg-[#07505E]/10"
            }
          `}
        >
          <Icon
            className={
              highlight
                ? "w-5 h-5 text-[#D99A16]"
                : "w-5 h-5 text-[#07505E]"
            }
          />
        </div>

        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#07505E] group-hover:translate-x-1 transition" />
      </div>

      <p className="mt-5 text-3xl font-bold text-[#073B4C]">
        {formatNumber(value)}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>
    </button>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-[#07505E]/30 transition flex items-center gap-4 text-left"
    >
      <div className="w-12 h-12 rounded-xl bg-[#6C994E]/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#6C994E]" />
      </div>

      <div>
        <p className="text-2xl font-bold text-[#073B4C]">
          {formatNumber(value)}
        </p>

        <p className="text-sm text-slate-500">
          {label}
        </p>
      </div>
    </button>
  );
}

function SectionHeader({
  title,
  description,
  icon: Icon,
  buttonLabel,
  onClick,
}) {
  return (
    <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-start sm:items-center justify-between gap-4">

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#07505E]/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-[#07505E]" />
        </div>

        <div>
          <h2 className="font-bold text-[#073B4C]">
            {title}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={onClick}
        className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#07505E] hover:text-[#073B4C] whitespace-nowrap"
      >
        {buttonLabel}

        <ArrowRight size={14} />
      </button>
    </div>
  );
}

function PendingOrganisationRow({
  organisation,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-5 sm:px-6 py-4 hover:bg-slate-50 transition"
    >
      <div className="flex items-start gap-4">

        <div className="w-11 h-11 rounded-xl bg-[#07505E]/10 flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-[#07505E]" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">
              <p className="font-semibold text-slate-800 truncate">
                {organisation.name}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {formatLabel(
                  organisation.organisation_type
                )}
              </p>
            </div>

            <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-semibold text-amber-700 shrink-0">
              Pending
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">

            {organisation.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} />

                {organisation.location}
              </span>
            )}

            {organisation.created_by
              ?.name && (
              <span className="inline-flex items-center gap-1">
                <UserRound size={13} />

                {
                  organisation
                    .created_by.name
                }
              </span>
            )}

            {(
              organisation.submitted_at ||
              organisation.created_at
            ) && (
              <span className="inline-flex items-center gap-1">
                <Clock3 size={13} />

                {formatDate(
                  organisation.submitted_at ||
                    organisation.created_at
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function PersonRow({
  person,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-5 sm:px-6 py-4 hover:bg-slate-50 transition"
    >
      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">

          {person.profile_image ? (
            <img
              src={person.profile_image}
              alt={person.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserRound className="w-5 h-5 text-slate-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">

          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {person.full_name}
            </p>

            {person.is_verified && (
              <CheckCircle2 className="w-4 h-4 text-[#6C994E] shrink-0" />
            )}
          </div>

          <p className="mt-1 text-xs text-slate-400 truncate">
            {formatLabel(
              person.person_type
            )}
            {person.location
              ? ` • ${person.location}`
              : ""}
          </p>
        </div>

        <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
      </div>
    </button>
  );
}

function ReviewStatus({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
      <p className="text-2xl font-bold text-[#073B4C]">
        {formatNumber(value)}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {label}
      </p>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-[#07505E]/30 hover:shadow-md transition"
    >
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-[#07505E]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#07505E]" />
        </div>

        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#07505E] group-hover:translate-x-1 transition" />
      </div>

      <h3 className="mt-4 font-bold text-[#073B4C]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </button>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-400" />
      </div>

      <h3 className="mt-4 font-semibold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        {description}
      </p>
    </div>
  );
}

function DashboardLoader() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">

      <div className="text-center">
        <Loader2 className="w-9 h-9 animate-spin text-[#07505E] mx-auto" />

        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading dashboard...
        </p>
      </div>
    </div>
  );
}

function formatLabel(value) {
  if (!value) {
    return "";
  }

  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );
}

function formatDate(value) {
  if (!value) return "";

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(
    Number(value) || 0
  );
}