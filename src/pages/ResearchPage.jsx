
import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  RefreshCw,
  LoaderCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Users,
  Building2,
  FolderKanban,
  Globe,
  LockKeyhole,
  Star,
  ExternalLink,
  CalendarDays,
} from "lucide-react";

import { researchApi } from "../api/researchApi";

const initialSummary = {
  total: 0,
  public: 0,
  private: 0,
  featured: 0,
  published: 0,
  ongoing: 0,
  completed: 0,
  planned: 0,
};

const statusStyles = {
  planned: "bg-amber-50 text-amber-700",
  ongoing: "bg-blue-50 text-blue-700",
  completed: "bg-emerald-50 text-emerald-700",
  published: "bg-purple-50 text-purple-700",
};

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatCard({ label, value, icon: Icon, accent = "text-[#07505E]" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className="rounded-xl bg-[#F0F6F2] p-2.5">
          <Icon size={19} className={accent} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-[#073B4C]">
        {value ?? 0}
      </p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="px-5 py-16 text-center">
      <BookOpen className="mx-auto mb-3 text-slate-300" size={40} />
      <p className="font-semibold text-slate-700">{message}</p>
      <p className="mt-1 text-sm text-slate-500">
        Try adjusting your search or filters.
      </p>
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <div className="break-words text-sm leading-6 text-slate-700">
        {children || "Not provided"}
      </div>
    </div>
  );
}

export default function ResearchPage() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [researchType, setResearchType] = useState("");
  const [visibility, setVisibility] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const loadResearch = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: "12",
      });

      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (researchType) params.set("research_type", researchType);
      if (visibility) params.set("visibility", visibility);

      const data = await researchApi.getAll(`?${params.toString()}`);

      setRecords(data.results || []);
      setSummary(data.summary || initialSummary);
      setStatuses(data.statuses || []);
      setTypes(data.research_types || []);
      setTotalPages(data.total_pages || 1);
      setTotalResults(data.count || 0);
    } catch (err) {
      setError(err.message || "Unable to load research records.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, researchType, visibility]);

  useEffect(() => {
    loadResearch();
  }, [loadResearch]);

  async function openDetails(id) {
    setSelected(null);
    setDetailError("");
    setDetailLoading(true);

    try {
      const data = await researchApi.getDetail(id);
      setSelected(data.research);
    } catch (err) {
      setDetailError(err.message || "Unable to load research details.");
    } finally {
      setDetailLoading(false);
    }
  }

  function applySearch(event) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function changeFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  const hasFilters = Boolean(search || status || researchType || visibility);

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setResearchType("");
    setVisibility("");
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-[#F8FAF7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Page heading */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#6C994E]">
              <FlaskConical size={17} />
              Ecosystem management
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#073B4C] sm:text-3xl">
              Research Management
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Explore research records, research questions, findings,
              researchers and their connections across the IGATI ecosystem.
            </p>
          </div>

          <button
            type="button"
            onClick={loadResearch}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#073B4C] shadow-sm transition hover:bg-slate-50 disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total research" value={summary.total} icon={BookOpen} />
          <StatCard label="Published" value={summary.published} icon={Globe} accent="text-purple-600" />
          <StatCard label="Ongoing" value={summary.ongoing} icon={FlaskConical} accent="text-blue-600" />
          <StatCard label="Featured research" value={summary.featured} icon={Star} accent="text-amber-600" />
        </div>

        {/* Status overview */}
        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-[#073B4C]">Research status</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a status to filter the records.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Planned", value: "planned", count: summary.planned },
              { label: "Ongoing", value: "ongoing", count: summary.ongoing },
              { label: "Completed", value: "completed", count: summary.completed },
              { label: "Published", value: "published", count: summary.published },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  changeFilter(setStatus, status === item.value ? "" : item.value)
                }
                className={`rounded-xl border p-4 text-left transition ${
                  status === item.value
                    ? "border-[#07505E] bg-[#F0F6F2]"
                    : "border-slate-100 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-[#073B4C]">
                  {item.count ?? 0}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Search and filters */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <form onSubmit={applySearch} className="flex flex-col gap-3 lg:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search title, question, findings, researcher..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#07505E] focus:ring-2 focus:ring-[#07505E]/10"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[#073B4C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#07505E]"
            >
              Search research
            </button>
          </form>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <select
              value={status}
              onChange={(event) => changeFilter(setStatus, event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#07505E]"
            >
              <option value="">All statuses</option>
              {statuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <select
              value={researchType}
              onChange={(event) => changeFilter(setResearchType, event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#07505E]"
            >
              <option value="">All research types</option>
              {types.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <select
              value={visibility}
              onChange={(event) => changeFilter(setVisibility, event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-[#07505E]"
            >
              <option value="">All visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {totalResults} research record{totalResults === 1 ? "" : "s"} found
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-[#07505E] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Research records */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold text-[#073B4C]">Research records</h2>
            <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
          </div>

          {error && (
            <div className="m-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p>{error}</p>
              <button onClick={loadResearch} className="mt-2 font-semibold underline">
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <LoaderCircle className="mb-3 animate-spin text-[#07505E]" size={30} />
              <p className="text-sm">Loading research records...</p>
            </div>
          ) : !error && records.length === 0 ? (
            <EmptyState message="No research records found" />
          ) : !error ? (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Research</th>
                      <th className="px-4 py-4 font-semibold">Type</th>
                      <th className="px-4 py-4 font-semibold">Status</th>
                      <th className="px-4 py-4 font-semibold">Visibility</th>
                      <th className="px-4 py-4 font-semibold">Created</th>
                      <th className="px-5 py-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.map((item) => (
                      <tr key={item.id} className="transition hover:bg-slate-50/80">
                        <td className="max-w-sm px-5 py-4">
                          <div className="flex items-start gap-3">
                            <div className="rounded-xl bg-[#F0F6F2] p-2.5 text-[#07505E]">
                              <BookOpen size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[#073B4C]">
                                {item.title}
                              </p>
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                {item.summary}
                              </p>
                              {item.is_featured && (
                                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                                  <Star size={12} /> Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {item.research_type_display || item.research_type}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusStyles[item.status] || "bg-slate-100 text-slate-600"
                          }`}>
                            {item.status_display || item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                            item.is_public ? "text-emerald-700" : "text-slate-500"
                          }`}>
                            {item.is_public ? <Globe size={14} /> : <LockKeyhole size={14} />}
                            {item.is_public ? "Public" : "Private"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => openDetails(item.id)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#07505E] hover:bg-[#F0F6F2]"
                          >
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="grid gap-3 p-3 md:hidden">
                {records.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-[#F0F6F2] p-2.5 text-[#07505E]">
                        <BookOpen size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold leading-5 text-[#073B4C]">
                          {item.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-500">
                          {item.summary}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[item.status] || "bg-slate-100 text-slate-600"
                      }`}>
                        {item.status_display || item.status}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        {item.research_type_display || item.research_type}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-400">
                        {formatDate(item.created_at)}
                      </span>
                      <button
                        onClick={() => openDetails(item.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#073B4C] px-3 py-2 text-xs font-semibold text-white"
                      >
                        <Eye size={14} /> View details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {/* Pagination */}
          {!loading && !error && records.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-slate-500">
                Showing page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((value) => Math.max(value - 1, 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Research details modal */}
      {(detailLoading || selected || detailError) && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#073B4C]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
              setDetailError("");
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-5 py-5 backdrop-blur sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#6C994E]">
                  Research record
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#073B4C]">
                  {selected?.title || (detailLoading ? "Loading details..." : "Research details")}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelected(null);
                  setDetailError("");
                }}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                aria-label="Close details"
              >
                <X size={18} />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex justify-center py-20">
                <LoaderCircle className="animate-spin text-[#07505E]" size={30} />
              </div>
            ) : detailError ? (
              <div className="p-6 text-sm text-red-600">{detailError}</div>
            ) : selected ? (
              <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1.5fr_1fr]">
                <div>
                  <div className="mb-5 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[selected.status] || "bg-slate-100 text-slate-600"
                    }`}>
                      {selected.status_display || selected.status}
                    </span>
                    <span className="rounded-full bg-[#F0F6F2] px-3 py-1 text-xs font-semibold text-[#07505E]">
                      {selected.research_type_display || selected.research_type}
                    </span>
                    {selected.is_featured && (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        Featured
                      </span>
                    )}
                  </div>

                  <DetailRow label="Summary">{selected.summary}</DetailRow>
                  <DetailRow label="Research question">{selected.research_question}</DetailRow>
                  <DetailRow label="Methodology">{selected.methodology}</DetailRow>
                  <DetailRow label="Findings">{selected.findings}</DetailRow>

                  {selected.publication_url && (
                    <a
                      href={selected.publication_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#073B4C] px-4 py-3 text-sm font-semibold text-white hover:bg-[#07505E]"
                    >
                      Open publication <ExternalLink size={16} />
                    </a>
                  )}
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
                  <h3 className="mb-2 font-semibold text-[#073B4C]">
                    Ecosystem connections
                  </h3>

                  <DetailRow label="Visibility">
                    {selected.is_public ? "Public" : "Private"}
                  </DetailRow>
                  <DetailRow label="Created">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={15} /> {formatDate(selected.created_at)}
                    </span>
                  </DetailRow>

                  <DetailRow label="Researchers">
                    {selected.researchers?.length ? (
                      <div className="space-y-2">
                        {selected.researchers.map((person) => (
                          <div key={person.id} className="flex items-center gap-2">
                            <Users size={15} className="text-[#6C994E]" />
                            {person.name}
                          </div>
                        ))}
                      </div>
                    ) : "No researchers linked"}
                  </DetailRow>

                  <DetailRow label="Institutions">
                    {selected.institutions?.length ? (
                      <div className="space-y-2">
                        {selected.institutions.map((org) => (
                          <div key={org.id} className="flex items-center gap-2">
                            <Building2 size={15} className="text-[#6C994E]" />
                            {org.name}
                          </div>
                        ))}
                      </div>
                    ) : "No institutions linked"}
                  </DetailRow>

                  <DetailRow label="Projects">
                    {selected.projects?.length ? (
                      <div className="space-y-2">
                        {selected.projects.map((project) => (
                          <div key={project.id} className="flex items-center gap-2">
                            <FolderKanban size={15} className="text-[#6C994E]" />
                            {project.title}
                          </div>
                        ))}
                      </div>
                    ) : "No projects linked"}
                  </DetailRow>

                  <DetailRow label="Living laboratories">
                    {selected.living_laboratories?.map((lab) => lab.name).join(", ")}
                  </DetailRow>

                  <DetailRow label="Communities">
                    {selected.communities?.map((community) => community.name).join(", ")}
                  </DetailRow>

                  <DetailRow label="Themes">
                    {selected.themes?.map((theme) => theme.name).join(", ")}
                  </DetailRow>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
