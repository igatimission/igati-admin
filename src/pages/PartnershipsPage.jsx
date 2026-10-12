
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Handshake,
  LoaderCircle,
  Search,
  Users,
  X,
} from "lucide-react";

import { partnershipApi } from "../api/partnershipApi";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "proposed", label: "Proposed" },
  { value: "engagement", label: "Engagement" },
  { value: "agreement", label: "Agreement / MoU" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "inactive", label: "Inactive" },
];

const STATUS_STYLES = {
  proposed: "bg-amber-50 text-amber-700 border-amber-100",
  engagement: "bg-blue-50 text-blue-700 border-blue-100",
  agreement: "bg-violet-50 text-violet-700 border-violet-100",
  active: "bg-green-50 text-green-700 border-green-100",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
  inactive: "bg-red-50 text-red-700 border-red-100",
};

function formatLabel(value = "") {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value) {
  if (!value) return "Not specified";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not specified"
    : date.toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] ||
        "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      {formatLabel(status || "unknown")}
    </span>
  );
}

function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#073B4C]">
            {value}
          </p>
          <p className="mt-2 text-xs text-gray-400">{description}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#073B4C]/5 text-[#073B4C]">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function DetailModal({ partnership, onClose }) {
  if (!partnership) return null;

  const detail = partnership.partnership || partnership;
  const organisation = detail.organisation;
  const partner = detail.partner;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#102D35]/50 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partnership-modal-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="sticky top-0 flex items-start justify-between border-b border-gray-100 bg-white p-6">
          <div className="pr-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6C994E]">
              Partnership details
            </p>
            <h2
              id="partnership-modal-title"
              className="mt-2 text-xl font-bold text-[#073B4C]"
            >
              {detail.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={detail.status} />
            <span className="text-sm text-gray-400">
              Added {formatDate(detail.created_at)}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <Building2 size={15} />
                Lead organisation
              </div>
              <p className="mt-3 font-semibold text-[#073B4C]">
                {organisation?.name || "Not specified"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <Handshake size={15} />
                Partner organisation
              </div>
              <p className="mt-3 font-semibold text-[#073B4C]">
                {partner?.name || "Not specified"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <CalendarDays size={15} />
                Start date
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700">
                {formatDate(detail.start_date)}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <CalendarDays size={15} />
                End date
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700">
                {formatDate(detail.end_date)}
              </p>
            </div>
          </div>

          <section>
            <h3 className="font-semibold text-[#073B4C]">Description</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-600">
              {detail.description || "No description provided."}
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-[#073B4C]">
              Collaboration areas
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-600">
              {detail.collaboration_areas ||
                "No collaboration areas specified."}
            </p>
          </section>

          {detail.agreement_url && (
            <a
              href={detail.agreement_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-[#073B4C] hover:bg-gray-50"
            >
              View agreement
              <ArrowUpRight size={16} />
            </a>
          )}

          <div className="rounded-xl bg-[#F8FAF7] p-4 text-sm text-gray-600">
            Public visibility:{" "}
            <span className="font-semibold text-[#073B4C]">
              {detail.is_public ? "Public" : "Private"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartnershipsPage() {
  const [partnerships, setPartnerships] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selectedPartnership, setSelectedPartnership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPartnerships = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);

      const query = params.toString();
      const response = await partnershipApi.getAll(
        query ? `?${query}` : ""
      );

      setPartnerships(response.results || []);
      setStatusCounts(response.status_counts || {});
    } catch (err) {
      setError(err.message || "Unable to load partnerships.");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    loadPartnerships();
  }, [loadPartnerships]);

  const stats = useMemo(() => {
    const counts = statusCounts;

    return {
      total: Object.values(counts).reduce(
        (sum, value) => sum + Number(value || 0),
        0
      ),
      active: counts.active || 0,
      proposed: counts.proposed || 0,
      completed: counts.completed || 0,
    };
  }, [statusCounts]);

  async function openDetails(id) {
    try {
      const response = await partnershipApi.getDetail(id);
      setSelectedPartnership(response);
    } catch (err) {
      setError(err.message || "Unable to load partnership details.");
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAF7] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#6C994E]">
              <Handshake size={17} />
              Ecosystem Management
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#073B4C] sm:text-3xl">
              Partnerships
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Monitor collaboration between organisations, review partnership
              arrangements and track their progress through the ecosystem.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPartnerships}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#073B4C] hover:bg-gray-50 disabled:opacity-50"
          >
            {loading && <LoaderCircle size={16} className="animate-spin" />}
            Refresh
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total partnerships"
            value={stats.total}
            description="All recorded partnership arrangements"
            icon={Handshake}
          />
          <StatCard
            title="Active"
            value={stats.active}
            description="Currently marked active"
            icon={CheckCircle2}
          />
          <StatCard
            title="Proposed"
            value={stats.proposed}
            description="Awaiting further development"
            icon={Clock3}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            description="Marked as completed"
            icon={Users}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, organisation or collaboration area..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#6C994E] focus:ring-2 focus:ring-[#6C994E]/10"
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#6C994E] md:w-56"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-bold text-[#073B4C]">
                Partnership directory
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                {partnerships.length} matching records
              </p>
            </div>

            <FileText size={19} className="text-gray-400" />
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-gray-400">
              <LoaderCircle size={28} className="animate-spin text-[#6C994E]" />
              <p className="text-sm">Loading partnerships...</p>
            </div>
          ) : partnerships.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#073B4C]/5 text-[#073B4C]">
                <Handshake size={26} />
              </div>
              <h3 className="mt-4 font-bold text-[#073B4C]">
                No partnerships found
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                No established partnership records match these filters. Try
                another search or check whether partnership records have been
                created.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Partnership</th>
                      <th className="px-5 py-4 font-semibold">Organisations</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Start date</th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {partnerships.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/70">
                        <td className="max-w-xs px-5 py-4">
                          <p className="font-semibold text-[#073B4C]">
                            {item.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-400">
                            {item.description || "No description"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-700">
                            {item.organisation?.name || "—"}
                          </p>
                          <p className="my-1 text-xs text-gray-400">with</p>
                          <p className="text-sm text-gray-600">
                            {item.partner?.name || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                          {formatDate(item.start_date)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => openDetails(item.id)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-[#073B4C] hover:border-[#6C994E] hover:bg-[#6C994E]/5"
                          >
                            View
                            <ArrowUpRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile/tablet cards */}
              <div className="grid gap-0 divide-y divide-gray-100 lg:hidden">
                {partnerships.map((item) => (
                  <article key={item.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold leading-6 text-[#073B4C]">
                        {item.title}
                      </h3>
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <Building2
                          size={16}
                          className="mt-0.5 shrink-0 text-gray-400"
                        />
                        <div className="text-sm">
                          <p className="font-medium text-gray-700">
                            {item.organisation?.name || "—"}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            Partner: {item.partner?.name || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <CalendarDays size={16} className="text-gray-400" />
                        Start: {formatDate(item.start_date)}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openDetails(item.id)}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#073B4C] hover:bg-gray-50"
                    >
                      View details
                      <ArrowUpRight size={15} />
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <DetailModal
        partnership={selectedPartnership}
        onClose={() => setSelectedPartnership(null)}
      />
    </div>
  );
}
