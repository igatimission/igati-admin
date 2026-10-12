
import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  Eye,
  X,
  CalendarDays,
  MapPin,
  ExternalLink,
  Star,
  BriefcaseBusiness,
  Users,
  Globe,
  LockKeyhole,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Filter,
} from "lucide-react";
import { opportunityApi } from "../api/opportunityApi";

const initialForm = {
  title: "",
  opportunity_type: "training",
  description: "",
  eligibility: "",
  location: "",
  requirements: "",
  deadline: "",
  status: "upcoming",
  how_to_apply: "",
  application_url: "",
  is_featured: false,
  is_public: true,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#07505E] focus:ring-2 focus:ring-[#07505E]/10";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

function formatDate(value) {
  if (!value) return "No deadline";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusStyle(status) {
  if (status === "open") return "bg-emerald-50 text-emerald-700";
  if (status === "closed") return "bg-rose-50 text-rose-700";
  return "bg-amber-50 text-amber-700";
}

function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function OpportunitiesPage() {
  const [data, setData] = useState({
    summary: {},
    opportunity_types: [],
    status_choices: [],
    results: [],
    count: 0,
    total_pages: 1,
    current_page: 1,
  });
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [visibility, setVisibility] = useState("");
  const [featured, setFeatured] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(initialForm);

  const loadOpportunities = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await opportunityApi.getAll({
        search,
        type,
        status,
        visibility,
        featured,
        page,
      });
      setData(result);
    } catch (err) {
      setError(err?.message || "Could not load opportunities.");
    } finally {
      setLoading(false);
    }
  }, [search, type, status, visibility, featured, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOpportunities();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadOpportunities]);

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  function openCreate() {
    setSelected(null);
    setForm(initialForm);
    setError("");
    setModal("form");
  }

  function openEdit(item) {
    setSelected(item);
    setForm({
      title: item.title || "",
      opportunity_type: item.opportunity_type || "training",
      description: item.description || "",
      eligibility: item.eligibility || "",
      location: item.location?.id ?? "",
      requirements: item.requirements || "",
      deadline: item.deadline
        ? new Date(item.deadline).toISOString().slice(0, 16)
        : "",
      status: item.status || "upcoming",
      how_to_apply: item.how_to_apply || "",
      application_url: item.application_url || "",
      is_featured: Boolean(item.is_featured),
      is_public: Boolean(item.is_public),
    });
    setError("");
    setModal("form");
  }

  async function openDetails(item) {
    setError("");
    try {
      const detail = await opportunityApi.getDetail(item.id);
      setSelected(detail);
      setModal("detail");
    } catch (err) {
      setError(err?.message || "Could not load opportunity details.");
    }
  }

  function setField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      ...form,
      location: form.location === "" ? null : Number(form.location),
      deadline: form.deadline
        ? new Date(form.deadline).toISOString()
        : null,
    };

    try {
      if (selected) {
        await opportunityApi.update(selected.id, payload);
        setNotice("Opportunity updated successfully.");
      } else {
        await opportunityApi.create(payload);
        setNotice("Opportunity created successfully.");
      }
      setModal(null);
      setSelected(null);
      setPage(1);
      await loadOpportunities();
    } catch (err) {
      setError(err?.message || "Could not save this opportunity.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await opportunityApi.delete(item.id);
      setNotice("Opportunity deleted successfully.");
      if (data.results.length === 1 && page > 1) setPage(page - 1);
      else await loadOpportunities();
    } catch (err) {
      setError(err?.message || "Could not delete this opportunity.");
    }
  }

  const summary = data.summary || {};

  const stats = [
    {
      label: "All opportunities",
      value: summary.total ?? 0,
      icon: BriefcaseBusiness,
      iconClass: "bg-sky-50 text-sky-700",
    },
    {
      label: "Open",
      value: summary.open ?? 0,
      icon: Globe,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Upcoming",
      value: summary.upcoming ?? 0,
      icon: CalendarDays,
      iconClass: "bg-amber-50 text-amber-700",
    },
    {
      label: "Featured",
      value: summary.featured ?? 0,
      icon: Star,
      iconClass: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF7] px-4 py-5 text-[#16313B] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6C994E]">
              <span className="h-2 w-2 rounded-full bg-[#6C994E]" />
              IGATI Global Mission Network
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Opportunities
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Manage training, funding, research, partnerships and other
              opportunities across the IGATI ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadOpportunities}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#07505E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#073B4C]"
            >
              <Plus size={17} />
              New opportunity
            </button>
          </div>
        </div>

        {notice && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notice}
            <button onClick={() => setNotice("")} aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <span>{error}</span>
            <button onClick={() => setError("")} aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, iconClass }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-slate-500 sm:text-sm">
                  {label}
                </p>
                <span className={`rounded-xl p-2 ${iconClass}`}>
                  <Icon size={18} />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-[#073B4C] sm:text-3xl">
                {value}
              </p>
            </div>
          ))}
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <Filter size={17} className="text-[#6C994E]" />
              <h2 className="font-semibold">Find opportunities</h2>
              <span className="ml-auto text-xs text-slate-500">
                {data.count ?? 0} result{data.count === 1 ? "" : "s"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <div className="relative sm:col-span-2 xl:col-span-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => updateFilter(setSearch, e.target.value)}
                  placeholder="Search opportunities..."
                  className={`${inputClass} pl-9`}
                />
              </div>

              <select
                value={type}
                onChange={(e) => updateFilter(setType, e.target.value)}
                className={inputClass}
              >
                <option value="">All types</option>
                {(data.opportunity_types || []).map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) => updateFilter(setStatus, e.target.value)}
                className={inputClass}
              >
                <option value="">All statuses</option>
                {(data.status_choices || []).map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <select
                value={visibility}
                onChange={(e) => updateFilter(setVisibility, e.target.value)}
                className={inputClass}
              >
                <option value="">All visibility</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

              <select
                value={featured}
                onChange={(e) => updateFilter(setFeatured, e.target.value)}
                className={inputClass}
              >
                <option value="">Featured and regular</option>
                <option value="true">Featured only</option>
                <option value="false">Not featured</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-500">
              <LoaderCircle size={30} className="animate-spin text-[#07505E]" />
              <p className="text-sm">Loading opportunities...</p>
            </div>
          ) : data.results?.length ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Opportunity</th>
                      <th className="px-4 py-4 font-semibold">Type</th>
                      <th className="px-4 py-4 font-semibold">Deadline</th>
                      <th className="px-4 py-4 font-semibold">Status</th>
                      <th className="px-4 py-4 font-semibold">Visibility</th>
                      <th className="px-5 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.results.map((item) => (
                      <tr key={item.id} className="transition hover:bg-slate-50/70">
                        <td className="max-w-sm px-5 py-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-xl bg-[#EAF2EF] p-2.5 text-[#07505E]">
                              <BriefcaseBusiness size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[#16313B]">
                                {item.title}
                              </p>
                              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                {item.eligibility}
                              </p>
                              {item.is_featured && (
                                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                                  <Star size={12} fill="currentColor" />
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className="bg-slate-100 text-slate-700">
                            {item.opportunity_type_display || item.opportunity_type}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays size={15} className="text-slate-400" />
                            {formatDate(item.deadline)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Badge className={statusStyle(item.status)}>
                            {item.status_display || item.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4">
                          {item.is_public ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                              <Globe size={14} /> Public
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <LockKeyhole size={14} /> Private
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              title="View details"
                              onClick={() => openDetails(item)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-700"
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              title="Edit opportunity"
                              onClick={() => openEdit(item)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                            >
                              <Pencil size={17} />
                            </button>
                            <button
                              title="Delete opportunity"
                              onClick={() => handleDelete(item)}
                              className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {data.results.map((item) => (
                  <article key={item.id} className="space-y-3 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-[#EAF2EF] p-2.5 text-[#07505E]">
                        <BriefcaseBusiness size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.opportunity_type_display || item.opportunity_type}
                        </p>
                      </div>
                      {item.is_featured && (
                        <Star size={16} className="shrink-0 text-amber-500" fill="currentColor" />
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-600">
                      {item.eligibility}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={statusStyle(item.status)}>
                        {item.status_display || item.status}
                      </Badge>
                      <Badge className="bg-slate-100 text-slate-600">
                        {item.is_public ? "Public" : "Private"}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <CalendarDays size={13} />
                        {formatDate(item.deadline)}
                      </span>
                    </div>
                    <div className="flex gap-2 border-t border-slate-100 pt-3">
                      <button
                        onClick={() => openDetails(item)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium"
                      >
                        <Eye size={15} /> View
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm font-medium"
                      >
                        <Pencil size={15} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        aria-label="Delete opportunity"
                        className="rounded-lg border border-rose-100 px-3 py-2 text-rose-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-500">
                  Page {data.current_page || page} of {data.total_pages || 1}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button
                    disabled={page >= (data.total_pages || 1)}
                    onClick={() =>
                      setPage((current) =>
                        Math.min(data.total_pages || 1, current + 1)
                      )
                    }
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
              <div className="rounded-2xl bg-[#EAF2EF] p-4 text-[#07505E]">
                <BriefcaseBusiness size={28} />
              </div>
              <h3 className="mt-4 font-semibold">No opportunities found</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Try changing your search filters, or create the first
                opportunity for the IGATI ecosystem.
              </p>
              <button
                onClick={openCreate}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#07505E] px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Plus size={16} /> Create opportunity
              </button>
            </div>
          )}
        </section>
      </div>

      {modal === "form" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold">
                  {selected ? "Edit opportunity" : "Create opportunity"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add accurate details so people know who can apply and how.
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close form"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto">
              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
                <Field label="Opportunity title *" className="sm:col-span-2">
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Community Innovation Training Programme"
                  />
                </Field>

                <Field label="Opportunity type *">
                  <select
                    required
                    value={form.opportunity_type}
                    onChange={(e) => setField("opportunity_type", e.target.value)}
                    className={inputClass}
                  >
                    {(data.opportunity_types || []).map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Status *">
                  <select
                    required
                    value={form.status}
                    onChange={(e) => setField("status", e.target.value)}
                    className={inputClass}
                  >
                    {(data.status_choices || []).map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Description *" className="sm:col-span-2">
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    className={inputClass}
                    placeholder="Describe the opportunity, its purpose and what participants can expect."
                  />
                </Field>

                <Field label="Who can participate? *" className="sm:col-span-2">
                  <textarea
                    required
                    rows={3}
                    value={form.eligibility}
                    onChange={(e) => setField("eligibility", e.target.value)}
                    className={inputClass}
                    placeholder="Describe eligible applicants, groups or organisations."
                  />
                </Field>

                <Field label="Requirements" className="sm:col-span-2">
                  <textarea
                    rows={3}
                    value={form.requirements}
                    onChange={(e) => setField("requirements", e.target.value)}
                    className={inputClass}
                    placeholder="Documents, qualifications or other requirements."
                  />
                </Field>

                <Field label="Location ID (optional)">
                  <input
                    type="number"
                    min="1"
                    value={form.location}
                    onChange={(e) => setField("location", e.target.value)}
                    className={inputClass}
                    placeholder="Enter an existing Location ID"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Leave blank if this opportunity has no specific location.
                  </p>
                </Field>

                <Field label="Application deadline">
                  <input
                    type="datetime-local"
                    value={form.deadline}
                    onChange={(e) => setField("deadline", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="How to apply *" className="sm:col-span-2">
                  <textarea
                    required
                    rows={3}
                    value={form.how_to_apply}
                    onChange={(e) => setField("how_to_apply", e.target.value)}
                    className={inputClass}
                    placeholder="Explain the application steps and required actions."
                  />
                </Field>

                <Field label="Application URL" className="sm:col-span-2">
                  <input
                    type="url"
                    value={form.application_url}
                    onChange={(e) => setField("application_url", e.target.value)}
                    className={inputClass}
                    placeholder="https://example.org/apply"
                  />
                </Field>

                <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:col-span-2 sm:flex-row sm:items-center sm:gap-8">
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) => setField("is_featured", e.target.checked)}
                      className="h-4 w-4 accent-[#07505E]"
                    />
                    Feature this opportunity
                  </label>
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.is_public}
                      onChange={(e) => setField("is_public", e.target.checked)}
                      className="h-4 w-4 accent-[#07505E]"
                    />
                    Make publicly visible
                  </label>
                </div>
              </div>

              {error && (
                <p className="mx-5 mb-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 sm:mx-6">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#07505E] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving && <LoaderCircle size={16} className="animate-spin" />}
                  {saving ? "Saving..." : selected ? "Save changes" : "Create opportunity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "detail" && selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
              <div className="pr-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge className="bg-slate-100 text-slate-700">
                    {selected.opportunity_type_display || selected.opportunity_type}
                  </Badge>
                  <Badge className={statusStyle(selected.status)}>
                    {selected.status_display || selected.status}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold">{selected.title}</h2>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close details"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={16} />
                  {formatDate(selected.deadline)}
                </span>
                {selected.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={16} />
                    {selected.location.name}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  {selected.is_public ? <Globe size={16} /> : <LockKeyhole size={16} />}
                  {selected.is_public ? "Public" : "Private"}
                </span>
              </div>

              <div>
                <h3 className="mb-1 font-semibold">Description</h3>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {selected.description || "No description provided."}
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Eligibility</h3>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {selected.eligibility || "Not specified."}
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Requirements</h3>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {selected.requirements || "No additional requirements specified."}
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">How to apply</h3>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {selected.how_to_apply || "Application instructions not provided."}
                </p>
                {selected.application_url && (
                  <a
                    href={selected.application_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#07505E] hover:underline"
                  >
                    Open application link <ExternalLink size={15} />
                  </a>
                )}
              </div>

              {[
                ["Living laboratories", selected.living_laboratories],
                ["Projects", selected.projects],
                ["Organisations", selected.organisations],
                ["People", selected.people],
                ["Innovations", selected.innovations],
                ["Research", selected.research],
                ["Markets", selected.markets],
                ["Themes", selected.themes],
              ].some(([, items]) => items?.length > 0) && (
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="mb-3 font-semibold">Related ecosystem records</h3>
                  <div className="space-y-3">
                    {[
                      ["Living laboratories", selected.living_laboratories],
                      ["Projects", selected.projects],
                      ["Organisations", selected.organisations],
                      ["People", selected.people],
                      ["Innovations", selected.innovations],
                      ["Research", selected.research],
                      ["Markets", selected.markets],
                      ["Themes", selected.themes],
                    ].map(([label, items]) =>
                      items?.length ? (
                        <div key={label}>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {label}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {items.map((entry) => (
                              <Badge key={entry.id} className="bg-slate-100 text-slate-600">
                                {entry.name || entry.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setModal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => openEdit(selected)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#07505E] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Pencil size={15} /> Edit opportunity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
