
import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  Search,
  RefreshCw,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  LockKeyhole,
  Star,
  CalendarDays,
  Users,
  Building2,
  FolderKanban,
  FlaskConical,
  ExternalLink,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { knowledgeApi } from "../api/knowledgeApi";

const initialSummary = {
  total: 0,
  public: 0,
  private: 0,
  featured: 0,
};

const formatDate = (value) => {
  if (!value) return "Not specified";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const typeLabel = (item) =>
  item.knowledge_type_display ||
  item.knowledge_type?.replaceAll("_", " ") ||
  "Knowledge output";

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-[#073B4C]">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <div className="rounded-xl bg-[#EAF3E4] p-3 text-[#547D37]">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function VisibilityBadge({ isPublic }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isPublic
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {isPublic ? <Globe size={13} /> : <LockKeyhole size={13} />}
      {isPublic ? "Public" : "Private"}
    </span>
  );
}

function KnowledgeDetails({ item, onClose }) {
  if (!item) return null;

  const RelationGroup = ({ title, icon: Icon, items }) => {
    if (!items?.length) return null;

    return (
      <div>
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#073B4C]">
          <Icon size={16} />
          {title}
        </h4>
        <div className="flex flex-wrap gap-2">
          {items.map((entry) => (
            <span
              key={entry.id}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-700"
            >
              {entry.title || entry.name}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-5 sm:p-6">
          <div className="pr-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6C994E]">
              Knowledge output
            </p>
            <h2 className="mt-2 text-xl font-bold text-[#073B4C] sm:text-2xl">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {typeLabel(item)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={21} />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <VisibilityBadge isPublic={item.is_public} />
            {item.is_featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                <Star size={13} /> Featured
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <CalendarDays size={14} />
              {formatDate(item.publication_date)}
            </span>
          </div>

          <section>
            <h3 className="mb-2 font-semibold text-[#073B4C]">Summary</h3>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {item.summary || "No summary provided."}
            </p>
          </section>

          <section>
            <h3 className="mb-2 font-semibold text-[#073B4C]">Content</h3>
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
              {item.content || "No additional content provided."}
            </p>
          </section>

          <div className="grid gap-5 sm:grid-cols-2">
            <RelationGroup
              title="Research"
              icon={FlaskConical}
              items={item.research}
            />
            <RelationGroup
              title="Projects"
              icon={FolderKanban}
              items={item.projects}
            />
            <RelationGroup
              title="Contributors"
              icon={Users}
              items={item.people}
            />
            <RelationGroup
              title="Organisations"
              icon={Building2}
              items={item.organisations}
            />
            <RelationGroup
              title="Communities"
              icon={Users}
              items={item.communities}
            />
            <RelationGroup
              title="Themes"
              icon={BookOpen}
              items={item.themes}
            />
          </div>

          {(item.file_url || item.external_url) && (
            <section>
              <h3 className="mb-3 font-semibold text-[#073B4C]">
                Resources
              </h3>
              <div className="flex flex-wrap gap-3">
                {item.file_url && (
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#073B4C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#07505E]"
                  >
                    <FileText size={16} /> Open file
                    <ExternalLink size={14} />
                  </a>
                )}
                {item.external_url && (
                  <a
                    href={item.external_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    External link <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KnowledgePage() {
  const [data, setData] = useState({
    results: [],
    summary: initialSummary,
    knowledge_types: [],
    count: 0,
    total_pages: 1,
    current_page: 1,
  });

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [visibility, setVisibility] = useState("");
  const [featured, setFeatured] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadKnowledge = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await knowledgeApi.getAll({
        search,
        type,
        visibility,
        featured,
        page,
      });

      setData({
        results: response.results || [],
        summary: response.summary || initialSummary,
        knowledge_types: response.knowledge_types || [],
        count: response.count || 0,
        total_pages: response.total_pages || 1,
        current_page: response.current_page || 1,
      });
    } catch (err) {
      setError(err.message || "Unable to load knowledge outputs.");
    } finally {
      setLoading(false);
    }
  }, [search, type, visibility, featured, page]);

  useEffect(() => {
    loadKnowledge();
  }, [loadKnowledge]);

  const openDetails = async (id) => {
    setDetailLoading(true);
    setError("");

    try {
      const item = await knowledgeApi.getDetail(id);
      setSelected(item);
    } catch (err) {
      setError(err.message || "Unable to load knowledge details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const changeFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-[#6C994E] focus:ring-2 focus:ring-[#6C994E]/15";

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#EAF3E4] p-3 text-[#547D37]">
              <BookOpen size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#073B4C] sm:text-3xl">
                Knowledge
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage research publications, reports, datasets and community knowledge.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadKnowledge}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#073B4C] shadow-sm hover:bg-slate-50 disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">{error}</div>
          <button
            onClick={() => setError("")}
            aria-label="Dismiss error"
            className="shrink-0"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="All knowledge"
          value={data.summary.total}
          description="Total records"
        />
        <StatCard
          icon={Globe}
          label="Public"
          value={data.summary.public}
          description="Available for public access"
        />
        <StatCard
          icon={LockKeyhole}
          label="Private"
          value={data.summary.private}
          description="Not publicly visible"
        />
        <StatCard
          icon={Star}
          label="Featured"
          value={data.summary.featured}
          description="Highlighted knowledge outputs"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search title, summary, content, contributor..."
                className={`${inputClass} pl-10`}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[510px]">
              <select
                value={type}
                onChange={(event) =>
                  changeFilter(setType, event.target.value)
                }
                className={inputClass}
              >
                <option value="">All types</option>
                {data.knowledge_types.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <select
                value={visibility}
                onChange={(event) =>
                  changeFilter(setVisibility, event.target.value)
                }
                className={inputClass}
              >
                <option value="">All visibility</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

              <select
                value={featured}
                onChange={(event) =>
                  changeFilter(setFeatured, event.target.value)
                }
                className={inputClass}
              >
                <option value="">Featured: all</option>
                <option value="true">Featured only</option>
                <option value="false">Not featured</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Showing {data.results.length} of {data.count} knowledge outputs
            </span>
            {(search || type || visibility || featured) && (
              <button
                onClick={() => {
                  setSearch("");
                  setType("");
                  setVisibility("");
                  setFeatured("");
                  setPage(1);
                }}
                className="font-semibold text-[#547D37] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500">
            <LoaderCircle size={21} className="animate-spin text-[#6C994E]" />
            Loading knowledge outputs...
          </div>
        ) : data.results.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
              <BookOpen size={28} />
            </div>
            <h3 className="mt-4 font-semibold text-[#073B4C]">
              No knowledge outputs found
            </h3>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              Try changing your search or filters. Knowledge records will appear here when available.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Knowledge output</th>
                    <th className="px-5 py-4 font-semibold">Type</th>
                    <th className="px-5 py-4 font-semibold">Publication date</th>
                    <th className="px-5 py-4 font-semibold">Visibility</th>
                    <th className="px-5 py-4 font-semibold">Featured</th>
                    <th className="px-5 py-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.results.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="max-w-sm px-5 py-4">
                        <p className="font-semibold text-[#073B4C]">
                          {item.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                          {item.summary || "No summary"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium capitalize text-slate-700">
                          {typeLabel(item)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(item.publication_date)}
                      </td>
                      <td className="px-5 py-4">
                        <VisibilityBadge isPublic={item.is_public} />
                      </td>
                      <td className="px-5 py-4">
                        {item.is_featured ? (
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700">
                            <Star size={15} /> Yes
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">No</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => openDetails(item.id)}
                          disabled={detailLoading}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#073B4C] hover:border-[#6C994E] hover:bg-[#F5F9F1] disabled:opacity-60"
                        >
                          <Eye size={15} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {data.results.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words font-semibold text-[#073B4C]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs capitalize text-slate-500">
                        {typeLabel(item)}
                      </p>
                    </div>
                    {item.is_featured && (
                      <Star
                        size={17}
                        className="shrink-0 fill-amber-400 text-amber-500"
                      />
                    )}
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {item.summary || "No summary"}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <VisibilityBadge isPublic={item.is_public} />
                    <span className="text-xs text-slate-500">
                      {formatDate(item.publication_date)}
                    </span>
                  </div>

                  <button
                    onClick={() => openDetails(item.id)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#073B4C] px-4 py-3 text-sm font-semibold text-white hover:bg-[#07505E]"
                  >
                    <Eye size={16} /> View details
                  </button>
                </article>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs text-slate-500">
            Page {data.current_page} of {Math.max(data.total_pages, 1)}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              disabled={page >= data.total_pages || loading}
              onClick={() =>
                setPage((current) =>
                  Math.min(data.total_pages, current + 1)
                )
              }
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {detailLoading && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-xl bg-[#073B4C] px-4 py-3 text-sm font-medium text-white shadow-xl">
          <LoaderCircle size={17} className="animate-spin" />
          Loading details...
        </div>
      )}

      {selected && (
        <KnowledgeDetails
          item={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
