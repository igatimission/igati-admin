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
  ShieldCheck,
  Clock3,
  MapPin,
  UserRound,
  Mail,
  Phone,
  Globe2,
  Eye,
  RefreshCcw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Filter,
  X,
  FileSearch,
  ArrowRight,
} from "lucide-react";

import {
  adminApi,
} from "../api/adminApi";

export default function OrganisationReviewsPage() {
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
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    organisationType,
    setOrganisationType,
  ] = useState("");

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

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
          await adminApi
            .pendingOrganisations();

        setOrganisations(
          response?.organisations || []
        );
      } catch (err) {
        setError(
          err?.message ||
            "Unable to load pending organisation reviews."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  const filteredOrganisations =
    useMemo(() => {
      let result = [
        ...organisations,
      ];

      const searchValue =
        search
          .trim()
          .toLowerCase();

      if (searchValue) {
        result = result.filter(
          (organisation) => {
            const searchable = [
              organisation.name,
              organisation.tagline,
              organisation.description,
              organisation.email,
              organisation.phone,
              organisation
                .created_by
                ?.full_name,
              organisation
                .location
                ?.name,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            return searchable.includes(
              searchValue
            );
          }
        );
      }

      if (organisationType) {
        result = result.filter(
          (organisation) =>
            organisation
              .organisation_type ===
            organisationType
        );
      }

      return result;
    }, [
      organisations,
      search,
      organisationType,
    ]);

  const organisationTypes =
    useMemo(() => {
      const types = new Map();

      organisations.forEach(
        (organisation) => {
          if (
            organisation
              .organisation_type
          ) {
            types.set(
              organisation
                .organisation_type,

              organisation
                .organisation_type_display ||
                formatLabel(
                  organisation
                    .organisation_type
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

  const clearFilters = () => {
    setSearch("");
    setOrganisationType("");
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
            <ShieldCheck className="w-4 h-4" />

            Organisation Approval
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-[#073B4C]">
            Organisation Reviews
          </h1>

          <p className="mt-2 max-w-3xl text-sm sm:text-base leading-7 text-slate-500">
            Review organisations and
            groups that have submitted
            applications to join the
            IGATI ecosystem.
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

          <div className="flex-1">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>
          </div>

          <button
            onClick={() =>
              setError("")
            }
            className="text-red-500"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          icon={Clock3}
          label="Pending Reviews"
          value={
            organisations.length
          }
        />

        <SummaryCard
          icon={Building2}
          label="Organisation Types"
          value={
            organisationTypes.length
          }
        />

        <SummaryCard
          icon={FileSearch}
          label="Showing"
          value={
            filteredOrganisations.length
          }
        />
      </div>

      {/* Filters */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-3">

          {/* Search */}
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
              placeholder="Search by organisation, applicant, location, email..."
              className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-3 text-sm outline-none focus:border-[#07505E] focus:ring-4 focus:ring-[#07505E]/10"
            />
          </div>

          {/* Type */}
          <div className="relative min-w-[220px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

            <select
              value={
                organisationType
              }
              onChange={(e) =>
                setOrganisationType(
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
            organisationType) && (
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

      {/* Reviews */}
      <section className="mt-6">
        {filteredOrganisations.length ===
        0 ? (
          <EmptyState
            filtered={
              Boolean(
                search ||
                  organisationType
              )
            }
            clearFilters={
              clearFilters
            }
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredOrganisations.map(
              (organisation) => (
                <OrganisationReviewCard
                  key={
                    organisation.id
                  }
                  organisation={
                    organisation
                  }
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

function OrganisationReviewCard({
  organisation,
  onReview,
}) {
  const creator =
    organisation?.created_by;

  const location =
    organisation?.location;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition">

      {/* Cover */}
      <div className="relative h-28 bg-gradient-to-br from-[#073B4C] via-[#07505E] to-[#6C994E]">
        {organisation.cover_image && (
          <>
            <img
              src={
                organisation.cover_image
              }
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-[#073B4C]/50" />
          </>
        )}

        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm">
            <Clock3 size={13} />

            Pending Review
          </span>
        </div>
      </div>

      <div className="px-5 sm:px-6 pb-6">

        {/* Logo */}
        <div className="-mt-9 relative">
          <div className="w-[72px] h-[72px] rounded-2xl border-4 border-white bg-white shadow-sm overflow-hidden flex items-center justify-center">
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

        {/* Name */}
        <div className="mt-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[#073B4C] truncate">
                {organisation.name}
              </h2>

              <p className="mt-1 text-sm font-medium text-[#07505E]">
                {organisation
                  .organisation_type_display ||
                  formatLabel(
                    organisation
                      .organisation_type
                  )}
              </p>
            </div>
          </div>

          {organisation.tagline && (
            <p className="mt-3 text-sm leading-6 text-slate-500 line-clamp-2">
              {organisation.tagline}
            </p>
          )}
        </div>

        {/* Meta */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">

          <InfoItem
            icon={UserRound}
            label="Submitted by"
            value={
              creator?.full_name ||
              "Not available"
            }
          />

          <InfoItem
            icon={MapPin}
            label="Location"
            value={
              location?.name ||
              "Not specified"
            }
          />

          <InfoItem
            icon={Mail}
            label="Email"
            value={
              organisation.email ||
              "Not specified"
            }
          />

          <InfoItem
            icon={Phone}
            label="Phone"
            value={
              organisation.phone ||
              "Not specified"
            }
          />
        </div>

        {/* Registration */}
        {organisation.registration_number && (
          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
            <p className="text-xs text-slate-400">
              Registration Number
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700">
              {
                organisation.registration_number
              }
            </p>
          </div>
        )}

        {/* Date */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock3 size={14} />

            Submitted{" "}
            {formatDate(
              organisation.submitted_at ||
                organisation.created_at
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">

          <button
            type="button"
            onClick={onReview}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#07505E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#073B4C] transition"
          >
            <Eye size={16} />

            Review Application
          </button>

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

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3">
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
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-[#07505E]/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#07505E]" />
      </div>

      <div>
        <p className="text-2xl font-bold text-[#073B4C]">
          {value}
        </p>

        <p className="text-sm text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  filtered,
  clearFilters,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white py-16 px-6 text-center shadow-sm">

      <div className="mx-auto w-14 h-14 rounded-2xl bg-[#6C994E]/10 flex items-center justify-center">
        {filtered ? (
          <Search className="w-6 h-6 text-[#6C994E]" />
        ) : (
          <CheckCircle2 className="w-6 h-6 text-[#6C994E]" />
        )}
      </div>

      <h2 className="mt-5 text-lg font-bold text-[#073B4C]">
        {filtered
          ? "No organisations found"
          : "No pending reviews"}
      </h2>

      <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
        {filtered
          ? "No pending organisation applications match the selected filters."
          : "There are currently no organisation applications waiting for administrative review."}
      </p>

      {filtered && (
        <button
          type="button"
          onClick={clearFilters}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#07505E]"
        >
          Clear Filters

          <ArrowRight size={15} />
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
          Loading organisation
          reviews...
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
    return "recently";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "recently";
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