
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  Globe,
  UserX,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  RefreshCw,
  LoaderCircle,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { peopleApi } from "../api/peopleApi";

const navy = "#073B4C";
const green = "#6C994E";
const gold = "#F2B632";

const EMPTY_SUMMARY = {
  total: 0,
  verified: 0,
  public: 0,
  inactive: 0,
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const labelize = (value = "") =>
  value.replaceAll("_", " ").replace(/\b\w/g, (letter) =>
    letter.toUpperCase()
  );

function StatusBadge({ children, tone = "gray" }) {
  const styles = {
    green: "bg-green-50 text-green-700 ring-green-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    blue: "bg-sky-50 text-sky-700 ring-sky-200",
    gold: "bg-amber-50 text-amber-700 ring-amber-200",
    gray: "bg-gray-100 text-gray-600 ring-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

function SummaryCard({ title, value, icon: Icon, tone }) {
  const backgrounds = {
    navy: "bg-sky-50 text-[#073B4C]",
    green: "bg-green-50 text-green-700",
    gold: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
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
        <div className={`rounded-xl p-3 ${backgrounds[tone]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-gray-100 py-3 last:border-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <div className="mt-1 break-words text-sm text-gray-700">
        {value || "Not provided"}
      </div>
    </div>
  );
}

function PersonDetailsModal({ person, onClose }) {
  if (!person) return null;

  const account = person.account || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#071A20]/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-lg font-bold text-[#073B4C]">
              Person profile
            </h2>
            <p className="text-sm text-gray-500">
              Member and account information
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close profile"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {person.profile_image ? (
              <img
                src={person.profile_image}
                alt=""
                className="h-20 w-20 rounded-2xl object-cover ring-1 ring-gray-200"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EAF1EE] text-[#073B4C]">
                <UserRound size={32} />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-[#16313B]">
                {person.full_name || "Unnamed member"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {person.role || labelize(person.person_type)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusBadge tone={person.is_verified ? "green" : "gold"}>
                  {person.is_verified ? "Verified" : "Unverified"}
                </StatusBadge>
                <StatusBadge tone={person.is_public ? "blue" : "gray"}>
                  {person.is_public ? "Public profile" : "Private profile"}
                </StatusBadge>
                <StatusBadge
                  tone={
                    person.is_active && account.is_active ? "green" : "red"
                  }
                >
                  {person.is_active && account.is_active ? "Active" : "Inactive"}
                </StatusBadge>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-7 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-bold text-[#073B4C]">
                Profile information
              </h4>
              <DetailRow label="Person type" value={person.person_type_display || labelize(person.person_type)} />
              <DetailRow label="Biography" value={person.bio} />
              <DetailRow label="What they do" value={person.what_i_do} />
              <DetailRow label="Expertise" value={person.expertise} />
              <DetailRow label="What they offer" value={person.what_i_offer} />
              <DetailRow label="What they need" value={person.what_i_need} />
              <DetailRow label="Interests" value={person.interests} />
              <DetailRow label="How to engage" value={person.how_to_engage} />
            </div>

            <div>
              <h4 className="mb-2 font-bold text-[#073B4C]">
                Contact and account
              </h4>
              <DetailRow label="Email" value={person.email} />
              <DetailRow label="Phone" value={person.phone} />
              <DetailRow label="Location" value={person.location?.name} />
              <DetailRow label="Username" value={account.username} />
              <DetailRow label="Platform role" value={labelize(account.role)} />
              <DetailRow label="Email verified" value={account.email_verified ? "Yes" : "No"} />
              <DetailRow label="Phone verified" value={account.phone_verified ? "Yes" : "No"} />
              <DetailRow label="Joined" value={formatDate(account.date_joined)} />
              <DetailRow label="Last login" value={formatDate(account.last_login)} />
              <DetailRow label="Profile created" value={formatDate(person.created_at)} />

              <div className="mt-4 flex flex-wrap gap-3">
                {person.linkedin_url && (
                  <a
                    href={person.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#07505E] hover:underline"
                  >
                    LinkedIn <ExternalLink size={14} />
                  </a>
                )}
                {person.website && (
                  <a
                    href={person.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#07505E] hover:underline"
                  >
                    Website <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {(person.communities?.length > 0 || person.themes?.length > 0) && (
            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="mb-3 font-bold text-[#073B4C]">Communities</h4>
                <div className="flex flex-wrap gap-2">
                  {person.communities?.map((item) => (
                    <StatusBadge key={item.id} tone="gray">
                      {item.name}
                    </StatusBadge>
                  ))}
                  {!person.communities?.length && (
                    <span className="text-sm text-gray-400">None listed</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="mb-3 font-bold text-[#073B4C]">Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {person.themes?.map((item) => (
                    <StatusBadge key={item.id} tone="green">
                      {item.name}
                    </StatusBadge>
                  ))}
                  {!person.themes?.length && (
                    <span className="text-sm text-gray-400">None listed</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-7 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-[#073B4C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#07505E]"
            >
              Close profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function PeoplePage() {
  const [people, setPeople] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [personTypes, setPersonTypes] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [personType, setPersonType] = useState("");
  const [verification, setVerification] = useState("");
  const [visibility, setVisibility] = useState("");
  const [accountStatus, setAccountStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPeople = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });

    if (search) params.set("search", search);
    if (personType) params.set("person_type", personType);
    if (verification) params.set("verification", verification);
    if (visibility) params.set("visibility", visibility);
    if (accountStatus) params.set("account_status", accountStatus);

    try {
      const data = await peopleApi.getAll(`?${params.toString()}`);
      setPeople(data.results || []);
      setSummary(data.summary || EMPTY_SUMMARY);
      setPersonTypes(data.person_types || []);
      setTotalPages(Math.max(data.total_pages || 1, 1));
      setTotalFiltered(data.count || 0);
    } catch (err) {
      setError(err.message || "Unable to load people.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, personType, verification, visibility, accountStatus]);

  useEffect(() => {
    loadPeople();
  }, [loadPeople]);

  const applySearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setPersonType("");
    setVerification("");
    setVisibility("");
    setAccountStatus("");
    setPage(1);
  };

  const hasFilters = Boolean(
    search || personType || verification || visibility || accountStatus
  );

  const openDetails = async (person) => {
    setSelectedPerson(person);
    setDetailLoading(true);

    try {
      const response = await peopleApi.getDetail(person.id);
      setSelectedPerson(response.person || person);
    } catch (err) {
      setError(err.message || "Unable to load full profile.");
    } finally {
      setDetailLoading(false);
    }
  };

  const startIndex = totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalFiltered);

  return (
    <div className="min-h-screen bg-[#F8FAF7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#6C994E]">
              <Users size={17} />
              PEOPLE & ORGANISATIONS
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#073B4C] sm:text-3xl">
              People Management
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
              Explore member profiles, expertise, contact information and account status across the IGATI ecosystem.
            </p>
          </div>

          <button
            onClick={loadPeople}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#073B4C] shadow-sm hover:bg-gray-50 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Total people" value={summary.total} icon={Users} tone="navy" />
          <SummaryCard title="Verified profiles" value={summary.verified} icon={CheckCircle2} tone="green" />
          <SummaryCard title="Public profiles" value={summary.public} icon={Globe} tone="gold" />
          <SummaryCard title="Inactive profiles" value={summary.inactive} icon={UserX} tone="red" />
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
                  placeholder="Search name, email, phone, username or expertise..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#6C994E] focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-[#073B4C] px-6 py-3 text-sm font-semibold text-white hover:bg-[#07505E]"
              >
                Search people
              </button>
            </form>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <select
                value={personType}
                onChange={(event) => {
                  setPersonType(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6C994E]"
              >
                <option value="">All person types</option>
                {personTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                value={verification}
                onChange={(event) => {
                  setVerification(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6C994E]"
              >
                <option value="">All verification statuses</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>

              <select
                value={visibility}
                onChange={(event) => {
                  setVisibility(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6C994E]"
              >
                <option value="">All profile visibility</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

              <select
                value={accountStatus}
                onChange={(event) => {
                  setAccountStatus(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6C994E]"
              >
                <option value="">All account statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
              <button
                onClick={loadPeople}
                className="self-start font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="font-bold text-[#16313B]">Community members</h2>
              <p className="mt-1 text-sm text-gray-500">
                {totalFiltered.toLocaleString()} matching profile{totalFiltered === 1 ? "" : "s"}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Showing {startIndex}–{endIndex} of {totalFiltered}
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-gray-500">
              <LoaderCircle size={30} className="animate-spin text-[#6C994E]" />
              <p className="text-sm">Loading people...</p>
            </div>
          ) : people.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-2xl bg-[#EAF1EE] p-4 text-[#073B4C]">
                <Users size={30} />
              </div>
              <h3 className="font-bold text-[#16313B]">No people found</h3>
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
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Person</th>
                      <th className="px-5 py-4 font-semibold">Type / role</th>
                      <th className="px-5 py-4 font-semibold">Location</th>
                      <th className="px-5 py-4 font-semibold">Verification</th>
                      <th className="px-5 py-4 font-semibold">Account</th>
                      <th className="px-5 py-4 font-semibold">Joined</th>
                      <th className="px-5 py-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {people.map((person) => (
                      <tr key={person.id} className="transition hover:bg-gray-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {person.profile_image ? (
                              <img
                                src={person.profile_image}
                                alt=""
                                className="h-11 w-11 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF1EE] text-[#073B4C]">
                                <UserRound size={20} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="max-w-56 truncate text-sm font-bold text-[#16313B]">
                                {person.full_name || "Unnamed member"}
                              </p>
                              <p className="max-w-56 truncate text-xs text-gray-500">
                                {person.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-700">
                            {person.person_type_display || labelize(person.person_type)}
                          </p>
                          <p className="mt-1 max-w-48 truncate text-xs text-gray-500">
                            {person.role || "Role not specified"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-gray-400" />
                            {person.location?.name || "Not provided"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge tone={person.is_verified ? "green" : "gold"}>
                            {person.is_verified ? "Verified" : "Unverified"}
                          </StatusBadge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col items-start gap-1.5">
                            <StatusBadge
                              tone={
                                person.is_active && person.account?.is_active
                                  ? "green"
                                  : "red"
                              }
                            >
                              {person.is_active && person.account?.is_active ? "Active" : "Inactive"}
                            </StatusBadge>
                            <span className="text-xs text-gray-400">
                              {person.is_public ? "Public profile" : "Private profile"}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                          {formatDate(person.created_at)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => openDetails(person)}
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

              <div className="grid gap-3 p-4 sm:grid-cols-2 lg:hidden">
                {people.map((person) => (
                  <article
                    key={person.id}
                    className="rounded-2xl border border-gray-200 p-4"
                  >
                    <div className="flex items-start gap-3">
                      {person.profile_image ? (
                        <img
                          src={person.profile_image}
                          alt=""
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EAF1EE] text-[#073B4C]">
                          <UserRound size={24} />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-bold text-[#16313B]">
                          {person.full_name || "Unnamed member"}
                        </h3>
                        <p className="mt-1 break-all text-xs text-gray-500">
                          {person.email || "No email"}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {person.person_type_display || labelize(person.person_type)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <StatusBadge tone={person.is_verified ? "green" : "gold"}>
                        {person.is_verified ? "Verified" : "Unverified"}
                      </StatusBadge>
                      <StatusBadge
                        tone={
                          person.is_active && person.account?.is_active
                            ? "green"
                            : "red"
                        }
                      >
                        {person.is_active && person.account?.is_active ? "Active" : "Inactive"}
                      </StatusBadge>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-gray-500">
                      <p className="flex items-center gap-2">
                        <MapPin size={15} />
                        {person.location?.name || "Location not provided"}
                      </p>
                      <p className="flex items-center gap-2 break-all">
                        <Phone size={15} />
                        {person.phone || "No phone"}
                      </p>
                    </div>

                    <button
                      onClick={() => openDetails(person)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#073B4C] px-4 py-3 text-sm font-semibold text-white hover:bg-[#07505E]"
                    >
                      <Eye size={16} /> View profile
                    </button>
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

        {detailLoading && selectedPerson && (
          <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-xl bg-[#073B4C] px-4 py-3 text-sm font-medium text-white shadow-xl">
            <LoaderCircle size={16} className="animate-spin" />
            Loading full profile...
          </div>
        )}

        <PersonDetailsModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      </div>
    </div>
  );
}
