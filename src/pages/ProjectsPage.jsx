
import { useCallback, useEffect, useState } from "react";
import {
  FolderKanban,
  Search,
  RefreshCw,
  LoaderCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  Building2,
  Users,
  Star,
  Globe,
  LockKeyhole,
  FlaskConical,
} from "lucide-react";
import { projectApi } from "../api/projectApi";

const EMPTY_SUMMARY = {
  total: 0,
  public: 0,
  private: 0,
  featured: 0,
  status_counts: {},
};

const formatDate = (value) => {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not set"
    : date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const labelize = (value = "") =>
  value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

const statusTone = (status) => {
  const tones = {
    active: "bg-green-50 text-green-700 ring-green-200",
    completed: "bg-blue-50 text-blue-700 ring-blue-200",
    planned: "bg-amber-50 text-amber-700 ring-amber-200",
    upcoming: "bg-purple-50 text-purple-700 ring-purple-200",
    paused: "bg-red-50 text-red-700 ring-red-200",
  };
  return tones[status] || "bg-gray-100 text-gray-600 ring-gray-200";
};

function StatusBadge({ status, label }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusTone(status)}`}
    >
      {label || labelize(status)}
    </span>
  );
}

function SummaryCard({ title, value, icon: Icon, tone }) {
  const tones = {
    navy: "bg-sky-50 text-[#073B4C]",
    green: "bg-green-50 text-green-700",
    gold: "bg-amber-50 text-amber-700",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-[#16313B]">
            {Number(value || 0).toLocaleString()}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${tones[tone]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, children }) {
  return (
    <div className="border-b border-gray-100 py-3 last:border-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <div className="mt-1 break-words text-sm leading-6 text-gray-700">
        {children || "Not provided"}
      </div>
    </div>
  );
}

function ProjectDetailsModal({ project, onClose }) {
  if (!project) return null;

  const lists = [
    ["Partners", project.partners],
    ["People involved", project.people],
    ["Communities", project.communities],
    ["Themes", project.themes],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#071A20]/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-lg font-bold text-[#073B4C]">
              Project details
            </h2>
            <p className="text-sm text-gray-500">
              Full project information and ecosystem relationships
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close project details"
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {project.cover_image || project.image ? (
          <img
            src={project.cover_image || project.image}
            alt=""
            className="h-48 w-full object-cover sm:h-64"
          />
        ) : (
          <div className="flex h-36 items-center justify-center bg-gradient-to-r from-[#073B4C] to-[#07505E] text-white">
            <FolderKanban size={48} />
          </div>
        )}

        <div className="p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <h3 className="text-2xl font-bold text-[#16313B]">
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Project slug: {project.slug}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={project.status} label={project.status_display} />
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${project.is_public ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {project.is_public ? "Public" : "Private"}
              </span>
              {project.is_featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  <Star size={12} /> Featured
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-7 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-bold text-[#073B4C]">Project overview</h4>
              <DetailItem label="Description">{project.description}</DetailItem>
              <DetailItem label="Problem addressed">{project.problem_addressed}</DetailItem>
              <DetailItem label="Current activity">{project.current_activity}</DetailItem>
              <DetailItem label="Resources required">{project.resources_required}</DetailItem>
              <DetailItem label="Achievements">{project.achievements}</DetailItem>
            </div>

            <div>
              <h4 className="mb-2 font-bold text-[#073B4C]">Timeline and ecosystem</h4>
              <DetailItem label="Location">
                {project.location?.name}
              </DetailItem>
              <DetailItem label="Living laboratory">
                {project.living_laboratory?.name}
              </DetailItem>
              <DetailItem label="Programme">
                {project.programme?.title}
              </DetailItem>
              <DetailItem label="Start date">{formatDate(project.start_date)}</DetailItem>
              <DetailItem label="End date">{formatDate(project.end_date)}</DetailItem>
              <DetailItem label="Created">{formatDate(project.created_at)}</DetailItem>
              <DetailItem label="Last updated">{formatDate(project.updated_at)}</DetailItem>
            </div>
          </div>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            {lists.map(([title, items]) => (
              <div key={title} className="rounded-2xl border border-gray-200 p-4">
                <h4 className="mb-3 font-bold text-[#073B4C]">{title}</h4>
                {items?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item.id}
                        className="rounded-lg bg-[#F0F5F1] px-3 py-1.5 text-sm text-[#07505E]"
                      >
                        {item.name || item.full_name || item.title}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No linked records</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-7 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-[#073B4C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#07505E]"
            >
              Close details
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [statuses, setStatuses] = useState([]);
  const [laboratories, setLaboratories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [laboratory, setLaboratory] = useState("");
  const [visibility, setVisibility] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });

    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (laboratory) params.set("living_laboratory", laboratory);
    if (visibility) params.set("visibility", visibility);

    try {
      const data = await projectApi.getAll(`?${params.toString()}`);
      setProjects(data.results || []);
      setSummary(data.summary || EMPTY_SUMMARY);
      setStatuses(data.statuses || []);
      setLaboratories(data.living_laboratories || []);
      setCount(data.count || 0);
      setTotalPages(Math.max(data.total_pages || 1, 1));
    } catch (err) {
      setError(err.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, laboratory, visibility]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const applySearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setLaboratory("");
    setVisibility("");
    setPage(1);
  };

  const hasFilters = Boolean(search || status || laboratory || visibility);

  const openDetails = async (project) => {
    setSelectedProject(project);
    setDetailLoading(true);

    try {
      const response = await projectApi.getDetail(project.id);
      setSelectedProject(response.project || project);
    } catch (err) {
      setError(err.message || "Unable to load project details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const startIndex = count ? (page - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(page * pageSize, count);

  return (
    <div className="min-h-screen bg-[#F8FAF7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#6C994E]">
              <FolderKanban size={17} />
              ECOSYSTEM MANAGEMENT
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#073B4C] sm:text-3xl">
              Projects Management
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
              Monitor ecosystem projects, their progress, participating communities, partners, and living laboratories.
            </p>
          </div>

          <button
            onClick={loadProjects}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#073B4C] shadow-sm hover:bg-gray-50 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Total projects" value={summary.total} icon={FolderKanban} tone="navy" />
          <SummaryCard title="Public projects" value={summary.public} icon={Globe} tone="green" />
          <SummaryCard title="Featured projects" value={summary.featured} icon={Star} tone="gold" />
          <SummaryCard title="Private projects" value={summary.private} icon={LockKeyhole} tone="gray" />
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {statuses.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setStatus(status === item.value ? "" : item.value);
                setPage(1);
              }}
              className={`rounded-xl border bg-white p-4 text-left shadow-sm transition ${
                status === item.value
                  ? "border-[#6C994E] ring-2 ring-green-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="mt-1 text-xl font-bold text-[#16313B]">
                {summary.status_counts?.[item.value] || 0}
              </p>
            </button>
          ))}
        </div>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-4 sm:p-5">
            <form onSubmit={applySearch} className="flex flex-col gap-3 lg:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search project, description, problem, partner or location..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#6C994E] focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-[#073B4C] px-6 py-3 text-sm font-semibold text-white hover:bg-[#07505E]"
              >
                Search projects
              </button>
            </form>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6C994E]"
              >
                <option value="">All project statuses</option>
                {statuses.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <select
                value={laboratory}
                onChange={(event) => {
                  setLaboratory(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6C994E]"
              >
                <option value="">All living laboratories</option>
                {laboratories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <select
                value={visibility}
                onChange={(event) => {
                  setVisibility(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6C994E]"
              >
                <option value="">All visibility settings</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            {hasFilters && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-[#07505E] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="m-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <button onClick={loadProjects} className="self-start font-semibold underline">
                Try again
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="font-bold text-[#16313B]">All projects</h2>
              <p className="mt-1 text-sm text-gray-500">
                {count.toLocaleString()} matching project{count === 1 ? "" : "s"}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Showing {startIndex}–{endIndex} of {count}
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-gray-500">
              <LoaderCircle size={30} className="animate-spin text-[#6C994E]" />
              <p className="text-sm">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-2xl bg-[#EAF1EE] p-4 text-[#073B4C]">
                <FolderKanban size={30} />
              </div>
              <h3 className="font-bold text-[#16313B]">No projects found</h3>
              <p className="mt-1 max-w-md text-sm text-gray-500">
                Try a different search or remove some filters.
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-xl bg-[#073B4C] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[950px] text-left">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Project</th>
                      <th className="px-5 py-4 font-semibold">Location / lab</th>
                      <th className="px-5 py-4 font-semibold">Timeline</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Visibility</th>
                      <th className="px-5 py-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {projects.map((project) => (
                      <tr key={project.id} className="transition hover:bg-gray-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {project.cover_image || project.image ? (
                              <img
                                src={project.cover_image || project.image}
                                alt=""
                                className="h-12 w-14 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-14 items-center justify-center rounded-xl bg-[#EAF1EE] text-[#073B4C]">
                                <FolderKanban size={21} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="max-w-64 truncate text-sm font-bold text-[#16313B]">
                                {project.title}
                              </p>
                              <p className="mt-1 max-w-64 truncate text-xs text-gray-500">
                                {project.description || project.problem_addressed}
                              </p>
                              {project.is_featured && (
                                <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                                  <Star size={12} /> Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="flex items-center gap-1.5 text-sm text-gray-700">
                            <MapPin size={14} className="text-gray-400" />
                            {project.location?.name || "Not specified"}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                            <FlaskConical size={13} />
                            {project.living_laboratory?.name || "No laboratory"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          <p>{formatDate(project.start_date)}</p>
                          <p className="mt-1 text-xs text-gray-400">
                            to {formatDate(project.end_date)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={project.status} label={project.status_display} />
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-sm ${project.is_public ? "text-green-700" : "text-gray-500"}`}>
                            {project.is_public ? <Globe size={15} /> : <LockKeyhole size={15} />}
                            {project.is_public ? "Public" : "Private"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => openDetails(project)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-[#073B4C] hover:border-[#6C994E] hover:bg-green-50"
                          >
                            <Eye size={15} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-4 sm:grid-cols-2 lg:hidden">
                {projects.map((project) => (
                  <article key={project.id} className="overflow-hidden rounded-2xl border border-gray-200">
                    {project.cover_image || project.image ? (
                      <img
                        src={project.cover_image || project.image}
                        alt=""
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-28 items-center justify-center bg-[#EAF1EE] text-[#073B4C]">
                        <FolderKanban size={32} />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status={project.status} label={project.status_display} />
                        {project.is_featured && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-[#16313B]">
                        {project.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                        {project.description || project.problem_addressed}
                      </p>
                      <div className="mt-4 space-y-2 text-sm text-gray-500">
                        <p className="flex items-center gap-2">
                          <MapPin size={15} />
                          {project.location?.name || "Location not specified"}
                        </p>
                        <p className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          {formatDate(project.start_date)} – {formatDate(project.end_date)}
                        </p>
                        <p className="flex items-center gap-2">
                          <FlaskConical size={15} />
                          {project.living_laboratory?.name || "No laboratory linked"}
                        </p>
                      </div>
                      <button
                        onClick={() => openDetails(project)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#073B4C] px-4 py-3 text-sm font-semibold text-white hover:bg-[#07505E]"
                      >
                        <Eye size={16} /> View project
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {detailLoading && selectedProject && (
          <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-xl bg-[#073B4C] px-4 py-3 text-sm font-medium text-white shadow-xl">
            <LoaderCircle size={16} className="animate-spin" />
            Loading full project details...
          </div>
        )}

        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </div>
  );
}
