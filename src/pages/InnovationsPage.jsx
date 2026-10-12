
import { useCallback, useEffect, useState } from "react";
import {
  Lightbulb,
  Search,
  RefreshCw,
  LoaderCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  Building2,
  FolderKanban,
  FlaskConical,
  Globe,
  LockKeyhole,
  Star,
  AlertCircle,
} from "lucide-react";

import { innovationApi } from "../api/innovationApi";

const initialSummary = {
  total: 0,
  public: 0,
  private: 0,
  featured: 0,
  idea: 0,
  prototype: 0,
  testing: 0,
  validated: 0,
  commercializing: 0,
  market: 0,
  scaled: 0,
};

const stageStyles = {
  idea: "bg-slate-100 text-slate-700",
  prototype: "bg-blue-50 text-blue-700",
  testing: "bg-amber-50 text-amber-700",
  validated: "bg-emerald-50 text-emerald-700",
  commercializing: "bg-purple-50 text-purple-700",
  market: "bg-teal-50 text-teal-700",
  scaled: "bg-green-100 text-green-800",
};

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

function formatDate(value) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

function RelatedList({ items, icon: Icon, getName }) {
  if (!items?.length) {
    return <span className="text-slate-400">No records linked</span>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-2">
          <Icon size={15} className="mt-1 shrink-0 text-[#6C994E]" />
          <span>{getName(item)}</span>
        </div>
      ))}
    </div>
  );
}

export default function InnovationsPage() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(initialSummary);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [innovationType, setInnovationType] = useState("");
  const [visibility, setVisibility] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const loadInnovations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: "12",
      });

      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (innovationType) params.set("innovation_type", innovationType);
      if (visibility) params.set("visibility", visibility);

      const data = await innovationApi.getAll(`?${params.toString()}`);

      setRecords(data.results || []);
      setSummary(data.summary || initialSummary);
      setStatuses(data.statuses || []);
      setTypes(data.innovation_types || []);
      setTotalPages(data.total_pages || 1);
      setTotalResults(data.count || 0);
    } catch (err) {
      setError(err.message || "Unable to load innovations.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, innovationType, visibility]);

  useEffect(() => {
    loadInnovations();
  }, [loadInnovations]);

  async function openDetails(id) {
    setSelected(null);
    setDetailError("");
    setDetailLoading(true);

    try {
      const data = await innovationApi.getDetail(id);
      setSelected(data.innovation);
    } catch (err) {
      setDetailError(err.message || "Unable to load innovation details.");
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

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setInnovationType("");
    setVisibility("");
    setPage(1);
  }

  const hasFilters = Boolean(search || status || innovationType || visibility);

  const stageCards = [
    { label: "Idea", value: "idea" },
    { label: "Prototype", value: "prototype" },
    { label: "Testing", value: "testing" },
    { label: "Validated", value: "validated" },
    { label: "Commercializing", value: "commercializing" },
    { label: "In market", value: "market" },
    { label: "Scaled", value: "scaled" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF7] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#6C994E]">
              <Lightbulb size={17} />
              Ecosystem management
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#073B4C] sm:text-3xl">
              Innovation Management
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor innovations, the problems they address, their development
              stages and their connections to people, research and enterprises.
            </p>
          </div>

          <button
            type="button"
            onClick={loadInnovations}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#073B4C] shadow-sm hover:bg-slate-50 disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total innovations" value={summary.total} icon={Lightbulb} />
          <StatCard label="In the market" value={summary.market} icon={Globe} accent="text-emerald-600" />
          <StatCard label="Scaled innovations" value={summary.scaled} icon={Star} accent="text-amber-600" />
          <StatCard label="Featured innovations" value={summary.featured} icon={FlaskConical} accent="text-purple-600" />
        </div>

        <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-[#073B4C]">Development pipeline</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a stage to see innovations at that point in development.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
            {stageCards.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  changeFilter(setStatus, status === item.value ? "" : item.value)
                }
                className={`rounded-xl border p-3 text-left transition ${
                  status === item.value
                    ? "border-[#07505E] bg-[#F0F6F2]"
                    : "border-slate-100 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <p className="text-xs leading-5 text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-[#073B4C]">
                  {summary[item.value] ?? 0}
                </p>
              </button>
            ))}
          </div>
        </div>

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
                placeholder="Search name, solution, problem or innovator..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#07505E] focus:ring-2 focus:ring-[#07505E]/10"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#073B4C] px-5 py-3 text-sm font-semibold text-white hover:bg-[#07505E]"
            >
              Search innovations
            </button>
          </form>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <select
              value={status}
              onChange={(event) => changeFilter(setStatus, event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#07505E]"
            >
              <option value="">All development stages</option>
              {statuses.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <select
              value={innovationType}
              onChange={(event) => changeFilter(setInnovationType, event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#07505E]"
            >
              <option value="">All innovation types</option>
              {types.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>

            <select
              value={visibility}
              onChange={(event) => changeFilter(setVisibility, event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#07505E]"
            >
              <option value="">All visibility</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              {totalResults} innovation{totalResults === 1 ? "" : "s"} found
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

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-semibold text-[#073B4C]">Innovation records</h2>
            <p className="text-xs text-slate-400">
              Page {page} of {totalPages}
            </p>
          </div>

          {error && (
            <div className="m-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p>{error}</p>
                <button onClick={loadInnovations} className="mt-2 font-semibold underline">
                  Try again
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <LoaderCircle className="mb-3 animate-spin text-[#07505E]" size={30} />
              <p className="text-sm">Loading innovations...</p>
            </div>
          ) : !error && records.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Lightbulb className="mx-auto mb-3 text-slate-300" size={40} />
              <p className="font-semibold text-slate-700">No innovations found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : !error ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Innovation</th>
                      <th className="px-4 py-4 font-semibold">Type</th>
                      <th className="px-4 py-4 font-semibold">Stage</th>
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
                              <Lightbulb size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[#073B4C]">{item.name}</p>
                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                {item.description}
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
                          {item.innovation_type_display || item.innovation_type}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            stageStyles[item.status] || "bg-slate-100 text-slate-600"
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

              <div className="grid gap-3 p-3 md:hidden">
                {records.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-[#F0F6F2] p-2.5 text-[#07505E]">
                        <Lightbulb size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold leading-5 text-[#073B4C]">
                          {item.name}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        stageStyles[item.status] || "bg-slate-100 text-slate-600"
                      }`}>
                        {item.status_display || item.status}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                        {item.innovation_type_display || item.innovation_type}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-400">{formatDate(item.created_at)}</span>
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

          {!loading && !error && records.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-slate-500">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((value) => Math.max(value - 1, 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium disabled:opacity-40"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium disabled:opacity-40"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
                  Innovation details
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#073B4C]">
                  {selected?.name || (detailLoading ? "Loading details..." : "Innovation details")}
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
                      stageStyles[selected.status] || "bg-slate-100 text-slate-600"
                    }`}>
                      {selected.status_display || selected.status}
                    </span>
                    <span className="rounded-full bg-[#F0F6F2] px-3 py-1 text-xs font-semibold text-[#07505E]">
                      {selected.innovation_type_display || selected.innovation_type}
                    </span>
                    {selected.is_featured && (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        Featured
                      </span>
                    )}
                  </div>

                  <DetailRow label="Description">{selected.description}</DetailRow>
                  <DetailRow label="Problem addressed">{selected.problem_addressed}</DetailRow>
                  <DetailRow label="Solution">{selected.solution}</DetailRow>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
                  <h3 className="mb-2 font-semibold text-[#073B4C]">
                    Ecosystem connections
                  </h3>
                  <DetailRow label="Visibility">
                    {selected.is_public ? "Public" : "Private"}
                  </DetailRow>
                  <DetailRow label="Created">{formatDate(selected.created_at)}</DetailRow>
                  <DetailRow label="Innovators">
                    <RelatedList items={selected.innovators} icon={Users} getName={(item) => item.name} />
                  </DetailRow>
                  <DetailRow label="Organisations">
                    <RelatedList items={selected.organisations} icon={Building2} getName={(item) => item.name} />
                  </DetailRow>
                  <DetailRow label="Projects">
                    <RelatedList items={selected.projects} icon={FolderKanban} getName={(item) => item.title} />
                  </DetailRow>
                  <DetailRow label="Related research">
                    <RelatedList items={selected.research} icon={FlaskConical} getName={(item) => item.title} />
                  </DetailRow>
                  <DetailRow label="Living laboratories">
                    {selected.living_laboratories?.map((item) => item.name).join(", ")}
                  </DetailRow>
                  <DetailRow label="Themes">
                    {selected.themes?.map((item) => item.name).join(", ")}
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
