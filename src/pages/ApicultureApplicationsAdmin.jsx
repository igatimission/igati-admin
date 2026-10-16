
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  LoaderCircle,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import { apicultureApi } from "../api/apicultureApi";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "contacted", label: "Contacted" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
];

const TYPE_LABELS = {
  farmer: "Farmer / Beekeeper",
  community_group: "Community Group",
  buyer_supplier: "Buyer / Supplier",
  partner: "Partner / Investor",
  researcher: "Researcher / Learner",
};

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  contacted: "bg-blue-50 text-blue-700 ring-blue-200",
  approved: "bg-green-50 text-green-700 ring-green-200",
  declined: "bg-red-50 text-red-700 ring-red-200",
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatusBadge({ status }) {
  const value = status || "pending";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ring-inset ${
        STATUS_STYLES[value] || "bg-slate-100 text-slate-700 ring-slate-200"
      }`}
    >
      {value}
    </span>
  );
}

function SummaryCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#073B4C]">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6C994E]/10 text-[#6C994E]">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function ApicultureApplicationsAdmin() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("pending");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const loadApplications = useCallback(async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await apicultureApi.getAdminApplications({
        search: search.trim(),
        status: statusFilter,
        application_type: typeFilter,
      });

      const rows = Array.isArray(response)
        ? response
        : Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response?.applications)
            ? response.applications
            : [];

      setApplications(rows);

      // Keep the opened review panel in sync with refreshed data.
      setSelected((previous) => {
        if (!previous) return null;
        return rows.find((item) => item.id === previous.id) || previous;
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to load applications. Check your staff login and API."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter, typeFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadApplications();
    }, 250);

    return () => clearTimeout(timer);
  }, [loadApplications]);

  const summary = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((item) => item.status === "pending").length,
      contacted: applications.filter((item) => item.status === "contacted").length,
      approved: applications.filter((item) => item.status === "approved").length,
      declined: applications.filter((item) => item.status === "declined").length,
    };
  }, [applications]);

  function openApplication(application) {
    setSelected(application);
    setReviewStatus(application.status || "pending");
    setAdminNotes(application.admin_notes || "");
    setActionMessage("");
    setActionError("");
  }

  async function saveReview(event) {
    event.preventDefault();

    if (!selected) return;

    setSaving(true);
    setActionError("");
    setActionMessage("");

    try {
      await apicultureApi.reviewApplication(selected.id, {
        status: reviewStatus,
        admin_notes: adminNotes,
      });

      setActionMessage("Application review saved successfully.");

      // Reload to get the authoritative record from Django.
      await loadApplications(true);

      setSelected((previous) =>
        previous
          ? {
              ...previous,
              status: reviewStatus,
              admin_notes: adminNotes,
            }
          : null
      );
    } catch (err) {
      setActionError(err.message || "Unable to save the review.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-slate-800">
      <div className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#6C994E]">
              <span className="h-2 w-2 rounded-full bg-[#6C994E]" />
              MUST–IGATI Community Ecosystem
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#073B4C] sm:text-3xl">
              Apiculture Applications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review expressions of interest from beekeepers, community groups,
              buyers, suppliers, researchers and programme partners.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadApplications(true)}
            disabled={refreshing || loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#073B4C] shadow-sm transition hover:bg-slate-50 disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-bold">Could not load applications</p>
              <p className="mt-1 whitespace-pre-line">{error}</p>
              <p className="mt-2 text-xs">
                Confirm that you are logged in as an authorised staff user and
                that the API sends your authentication token.
              </p>
            </div>
          </div>
        )}

        {/* Summary cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            title="Loaded results"
            value={summary.total}
            icon={FileText}
            description="Applications matching your filters"
          />
          <SummaryCard
            title="Pending"
            value={summary.pending}
            icon={Clock3}
            description="Awaiting a decision"
          />
          <SummaryCard
            title="Contacted"
            value={summary.contacted}
            icon={Users}
            description="Follow-up initiated"
          />
          <SummaryCard
            title="Approved"
            value={summary.approved}
            icon={CheckCircle2}
            description="Approved applications"
          />
          <SummaryCard
            title="Declined"
            value={summary.declined}
            icon={AlertCircle}
            description="Declined applications"
          />
        </div>

        {/* Table panel */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#073B4C]">
                  Application register
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search records and open an application to review it.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:flex">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Name, phone, organisation..."
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[#6C994E] sm:w-72"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#6C994E]"
                  aria-label="Filter by status"
                >
                  <option value="all">All statuses</option>
                  {STATUS_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#6C994E]"
                  aria-label="Filter by application type"
                >
                  <option value="all">All application types</option>
                  {Object.entries(TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-500">
              <LoaderCircle className="animate-spin text-[#6C994E]" size={28} />
              <p className="text-sm">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FileText size={25} />
              </div>
              <h3 className="mt-4 font-bold text-[#073B4C]">
                No applications found
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                There are no records matching the current filters. Try changing
                your search or status.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
                className="mt-4 text-sm font-bold text-[#07505E] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-bold">Applicant</th>
                      <th className="px-6 py-4 font-bold">Application type</th>
                      <th className="px-6 py-4 font-bold">Ward</th>
                      <th className="px-6 py-4 font-bold">Submitted</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 text-right font-bold">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {applications.map((application) => (
                      <tr
                        key={application.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#073B4C]">
                            {application.full_name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {application.phone}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {application.application_number || `ID #${application.id}`}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {TYPE_LABELS[application.application_type] ||
                            application.application_type}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {application.ward ||
                            application.ward?.name ||
                            "—"}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                          {formatDate(application.submitted_at)}
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge status={application.status} />
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => openApplication(application)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[#073B4C] transition hover:border-[#6C994E] hover:bg-[#6C994E]/5"
                          >
                            <Eye size={15} />
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 p-4 lg:hidden">
                {applications.map((application) => (
                  <article
                    key={application.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words font-bold text-[#073B4C]">
                          {application.full_name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {application.phone}
                        </p>
                      </div>
                      <StatusBadge status={application.status} />
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <p className="text-slate-600">
                        <span className="font-semibold">Type:</span>{" "}
                        {TYPE_LABELS[application.application_type] ||
                          application.application_type}
                      </p>
                      <p className="text-slate-600">
                        <span className="font-semibold">Ward:</span>{" "}
                        {application.ward_name ||
                          application.ward?.name ||
                          "—"}
                      </p>
                      <p className="text-slate-500">
                        <span className="font-semibold">Submitted:</span>{" "}
                        {formatDate(application.created_at)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openApplication(application)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#073B4C] px-4 py-3 text-sm font-bold text-white hover:bg-[#07505E]"
                    >
                      <Eye size={16} />
                      View and review
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}

          <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {applications.length} matching application
              {applications.length === 1 ? "" : "s"}
            </span>
            <span>Applicant details are restricted to authorised staff.</span>
          </div>
        </section>
      </div>

      {/* Review modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setSelected(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-review-title"
            className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-5 py-5 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6C994E]">
                  Application review
                </p>
                <h2
                  id="application-review-title"
                  className="mt-2 text-xl font-bold text-[#073B4C]"
                >
                  {selected.full_name}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {selected.application_number || `Application ID #${selected.id}`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                disabled={saving}
                aria-label="Close application review"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
              >
                <X size={21} />
              </button>
            </div>

            <div className="space-y-7 p-5 sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Full name", selected.full_name],
                  ["Phone", selected.phone],
                  ["Email", selected.email],
                  [
                    "Application type",
                    TYPE_LABELS[selected.application_type] ||
                      selected.application_type,
                  ],
                  [
                    "Organisation / group",
                    selected.organisation_name || "Not provided",
                  ],
                  ["Group type", selected.group_type || "Not provided"],
                  [
                    "Ward",
                    selected.ward_name || selected.ward?.name || "—",
                  ],
                  ["Village", selected.village_name || "Not provided"],
                  ["Submitted", formatDate(selected.created_at)],
                  ["Last reviewed", formatDate(selected.reviewed_at)],
                  ["Reviewed by", selected.reviewed_by_name || "Not reviewed"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <p className="text-xs font-semibold text-slate-500">
                      {label}
                    </p>
                    <p className="mt-2 break-words text-sm font-semibold text-[#073B4C]">
                      {value || "—"}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#073B4C]">
                  Applicant's message
                </h3>
                <p className="mt-2 min-h-20 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
                  {selected.message || "No additional message provided."}
                </p>
              </div>

              <form onSubmit={saveReview} className="space-y-5">
                <div>
                  <label
                    htmlFor="application-status"
                    className="mb-2 block text-sm font-bold text-[#073B4C]"
                  >
                    Update application status
                  </label>
                  <select
                    id="application-status"
                    value={reviewStatus}
                    onChange={(event) => setReviewStatus(event.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#6C994E] focus:ring-4 focus:ring-[#6C994E]/10"
                  >
                    {STATUS_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="application-admin-notes"
                    className="mb-2 block text-sm font-bold text-[#073B4C]"
                  >
                    Internal staff notes
                  </label>
                  <textarea
                    id="application-admin-notes"
                    rows={4}
                    maxLength={10000}
                    value={adminNotes}
                    onChange={(event) => setAdminNotes(event.target.value)}
                    placeholder="Record follow-up actions, verification notes or reasons for the decision..."
                    className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3.5 text-sm leading-6 outline-none focus:border-[#6C994E] focus:ring-4 focus:ring-[#6C994E]/10"
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">
                    {adminNotes.length}/10000 characters
                  </p>
                </div>

                {actionError && (
                  <div
                    role="alert"
                    className="whitespace-pre-line rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    {actionError}
                  </div>
                )}

                {actionMessage && (
                  <div
                    role="status"
                    className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800"
                  >
                    <CheckCircle2 size={17} />
                    {actionMessage}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setSelected(null)}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#073B4C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#07505E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <LoaderCircle className="animate-spin" size={17} />
                        Saving review...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        Save review
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
