import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Building2,
  Search,
  Filter,
  RefreshCcw,
  Loader2,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  Globe2,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Eye,
  ShieldCheck,
  X,
  UserRound,
} from "lucide-react";

import {
  adminApi,
} from "../api/adminApi";

export default function OrganisationsPage() {
  const navigate = useNavigate();

  const [
    organisations,
    setOrganisations,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("");

  const [
    typeFilter,
    setTypeFilter,
  ] = useState("");

  useEffect(() => {
    loadOrganisations();
  }, []);

  const loadOrganisations =
    async ({
      showRefresh = false,
    } = {}) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response =
          await adminApi.organisations();

        setOrganisations(
          response?.organisations || []
        );
      } catch (err) {
        setError(
          err?.message ||
            "Unable to load organisations."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  const organisationTypes =
    useMemo(() => {
      const types = new Map();

      organisations.forEach(
        (organisation) => {
          if (
            organisation.organisation_type
          ) {
            types.set(
              organisation.organisation_type,
              organisation
                .organisation_type_display ||
                formatLabel(
                  organisation.organisation_type
                )
            );
          }
        }
      );

      return Array.from(
        types.entries()
      ).map(
        ([value, label]) => ({
          value,
          label,
        })
      );
    }, [organisations]);

  const filteredOrganisations =
    useMemo(() => {
      let result = [
        ...organisations,
      ];

      const term =
        search.trim().toLowerCase();

      if (term) {
        result = result.filter(
          (organisation) => {
            const searchable = [
              organisation.name,
              organisation.tagline,
              organisation.description,
              organisation.email,
              organisation.phone,
              organisation.registration_number,
              organisation
                .location
                ?.name,
              organisation
                .created_by
                ?.full_name,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            return searchable.includes(
              term
            );
          }
        );
      }

      if (statusFilter) {
        result = result.filter(
          (organisation) =>
            organisation
              .approval_status ===
            statusFilter
        );
      }

      if (typeFilter) {
        result = result.filter(
          (organisation) =>
            organisation
              .organisation_type ===
            typeFilter
        );
      }

      return result;
    }, [
      organisations,
      search,
      statusFilter,
      typeFilter,
    ]);

  const summary = useMemo(() => {
    const data = {
      total: organisations.length,
      approved: 0,
      pending: 0,
      changes_requested: 0,
      rejected: 0,
    };

    organisations.forEach(
      (organisation) => {
        const status =
          organisation.approval_status;

        if (
          Object.prototype.hasOwnProperty.call(
            data,
            status
          )
        ) {
          data[status] += 1;
        }
      }
    );

    return data;
  }, [organisations]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setTypeFilter("");
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#07505E]/10 px-3 py-1.5 text-xs font-semibold text-[#07505E]">
            <Building2 className="w-4 h-4" />

            People & Organisations
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-[#073B4C]">
            Organisations
          </h1>

          <p className="mt-2 max-w-3xl text-sm sm:text-base leading-7 text-slate-500">
            View and manage organisations
            registered within the IGATI
            ecosystem.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            loadOrganisations({
              showRefresh: true,
            })
          }
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCcw
            className={`w-4 h-4 ${
              refreshing
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />

          <p className="flex-1 text-sm font-medium text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <X
              size={16}
              className="text-red-500"
            />
          </button>
        </div>
      )}

      {/* Summary */}
      <section className="mt-7 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">

        <SummaryCard
          label="Total"
          value={summary.total}
          icon={Building2}
        />

        <SummaryCard
          label="Approved"
          value={summary.approved}
          icon={CheckCircle2}
        />

        <SummaryCard
          label="Pending"
          value={summary.pending}
          icon={Clock3}
        />

        <SummaryCard
          label="Changes Requested"
          value={
            summary.changes_requested
          }
          icon={AlertTriangle}
        />

        <SummaryCard
          label="Rejected"
          value={summary.rejected}
          icon={XCircle}
        />
      </section>

      {/* Filters */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">

        <div className="flex flex-col xl:flex-row gap-3">

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search organisations, email, applicant, registration number..."
              className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-3 text-sm outline-none focus:border-[#07505E] focus:ring-4 focus:ring-[#07505E]/10"
            />
          </div>

          <div className="relative min-w-[190px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white pl-11 pr-8 py-3 text-sm outline-none focus:border-[#07505E] focus:ring-4 focus:ring-[#07505E]/10"
            >
              <option value="">
                All statuses
              </option>

              <option value="draft">
                Draft
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="changes_requested">
                Changes Requested
              </option>

              <option value="rejected">
                Rejected
              </option>

              <option value="suspended">
                Suspended
              </option>
            </select>
          </div>

          <div className="relative min-w-[220px]">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(
                  e.target.value
                )
              }
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white pl-11 pr-8 py-3 text-sm outline-none focus:border-[#07505E] focus:ring-4 focus:ring-[#07505E]/10"
            >
              <option value="">
                All organisation types
              </option>

              {organisationTypes.map(
                (type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                )
              )}
            </select>
          </div>

          {(search ||
            statusFilter ||
            typeFilter) && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Count */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {
              filteredOrganisations.length
            }
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {organisations.length}
          </span>{" "}
          organisations
        </p>
      </div>

      {/* Organisations */}
      <section className="mt-4">
        {filteredOrganisations.length ===
        0 ? (
          <EmptyState
            filtered={
              Boolean(
                search ||
                  statusFilter ||
                  typeFilter
              )
            }
            onClear={clearFilters}
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredOrganisations.map(
              (organisation) => (
                <OrganisationCard
                  key={
                    organisation.id
                  }
                  organisation={
                    organisation
                  }
                  onOpen={() => {
                    if (
                      organisation
                        .approval_status ===
                      "pending"
                    ) {
                      navigate(
                        `/organisation-reviews/${organisation.slug}`
                      );
                    } else {
                      navigate(
                        `/organisations/${organisation.slug}`
                      );
                    }
                  }}
                  onReview={() =>
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
    </div>
  );
}

function OrganisationCard({
  organisation,
  onOpen,
  onReview,
}) {
  const creator =
    organisation.created_by;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition">

      <div className="relative h-24 bg-gradient-to-br from-[#073B4C] via-[#07505E] to-[#6C994E]">

        {organisation.cover_image && (
          <>
            <img
              src={
                organisation.cover_image
              }
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-[#073B4C]/45" />
          </>
        )}

        <div className="absolute top-4 right-4">
          <StatusBadge
            status={
              organisation
                .approval_status
            }
          />
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-6">

        <div className="-mt-8 relative">
          <div className="w-16 h-16 rounded-2xl border-4 border-white bg-white shadow-sm overflow-hidden flex items-center justify-center">

            {organisation.logo ? (
              <img
                src={
                  organisation.logo
                }
                alt={
                  organisation.name
                }
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-7 h-7 text-slate-400" />
            )}
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-bold text-[#073B4C]">
            {organisation.name}
          </h2>

          <p className="mt-1 text-xs font-semibold text-[#07505E]">
            {organisation
              .organisation_type_display ||
              formatLabel(
                organisation
                  .organisation_type
              )}
          </p>

          {organisation.tagline && (
            <p className="mt-3 text-sm leading-6 text-slate-500 line-clamp-2">
              {organisation.tagline}
            </p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">

          {organisation.location?.name && (
            <MetaItem
              icon={MapPin}
              label="Location"
              value={
                organisation.location
                  .name
              }
            />
          )}

          {creator?.full_name && (
            <MetaItem
              icon={UserRound}
              label="Created By"
              value={
                creator.full_name
              }
            />
          )}

          {organisation.email && (
            <MetaItem
              icon={Mail}
              label="Email"
              value={
                organisation.email
              }
            />
          )}

          {organisation.phone && (
            <MetaItem
              icon={Phone}
              label="Phone"
              value={
                organisation.phone
              }
            />
          )}
        </div>

        {organisation.registration_number && (
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-[11px] text-slate-400">
              Registration Number
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {
                organisation.registration_number
              }
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Clock3 size={14} />

          Created{" "}
          {formatDate(
            organisation.created_at
          )}
        </div>

        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">

          <button
            type="button"
            onClick={onOpen}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#07505E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#073B4C] transition"
          >
            <Eye size={16} />

            {organisation
              .approval_status ===
            "pending"
              ? "Review"
              : "View Details"}
          </button>

          {organisation
            .approval_status ===
            "pending" && (
            <button
              type="button"
              onClick={onReview}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F2B632] bg-[#F2B632]/10 px-4 py-3 text-sm font-semibold text-[#9a6a00]"
            >
              <ShieldCheck size={16} />

              Review
            </button>
          )}

          {organisation.website && (
            <a
              href={
                organisation.website
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Globe2 size={16} />

              Website
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-3">
      <div className="w-8 h-8 rounded-lg bg-[#07505E]/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#07505E]" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-xs font-semibold text-slate-700 truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-[#07505E]/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#07505E]" />
      </div>

      <p className="mt-4 text-2xl font-bold text-[#073B4C]">
        {value}
      </p>

      <p className="mt-1 text-xs sm:text-sm text-slate-500">
        {label}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}) {
  const config = {
    draft: {
      label: "Draft",
      className:
        "bg-slate-50 border-slate-200 text-slate-600",
      icon: FileText,
    },

    pending: {
      label: "Pending",
      className:
        "bg-amber-50 border-amber-200 text-amber-700",
      icon: Clock3,
    },

    approved: {
      label: "Approved",
      className:
        "bg-green-50 border-green-200 text-green-700",
      icon: CheckCircle2,
    },

    changes_requested: {
      label: "Changes Requested",
      className:
        "bg-orange-50 border-orange-200 text-orange-700",
      icon: AlertTriangle,
    },

    rejected: {
      label: "Rejected",
      className:
        "bg-red-50 border-red-200 text-red-700",
      icon: XCircle,
    },

    suspended: {
      label: "Suspended",
      className:
        "bg-red-50 border-red-200 text-red-700",
      icon: XCircle,
    },
  };

  const item =
    config[status] ||
    config.draft;

  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold ${item.className}`}
    >
      <Icon size={12} />

      {item.label}
    </span>
  );
}

function EmptyState({
  filtered,
  onClear,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white py-16 px-6 text-center shadow-sm">

      <div className="mx-auto w-14 h-14 rounded-2xl bg-[#07505E]/10 flex items-center justify-center">
        <Building2 className="w-6 h-6 text-[#07505E]" />
      </div>

      <h2 className="mt-5 text-lg font-bold text-[#073B4C]">
        {filtered
          ? "No organisations found"
          : "No organisations yet"}
      </h2>

      <p className="mt-2 max-w-md mx-auto text-sm text-slate-500">
        {filtered
          ? "No organisations match your current search and filters."
          : "Registered organisations will appear here."}
      </p>

      {filtered && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 text-sm font-semibold text-[#07505E]"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-9 h-9 animate-spin text-[#07505E] mx-auto" />

        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading organisations...
        </p>
      </div>
    </div>
  );
}

function formatLabel(value) {
  if (!value) return "";

  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );
}

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not available";
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