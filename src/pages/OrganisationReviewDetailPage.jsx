import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCcw,
  Loader2,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  Globe2,
  UserRound,
  CalendarDays,
  FileText,
  ExternalLink,
  Target,
  Eye,
  Handshake,
  Lightbulb,
  CircleDollarSign,
  Clock3,
  BadgeCheck,
  MessageSquareText,
  X,
} from "lucide-react";

import {
  adminApi,
} from "../api/adminApi";

export default function OrganisationReviewDetailPage() {
  const { slug } = useParams();

  const navigate = useNavigate();

  const [
    organisation,
    setOrganisation,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    modal,
    setModal,
  ] = useState(null);

  const [
    reviewNotes,
    setReviewNotes,
  ] = useState("");

  const [
    actionError,
    setActionError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  useEffect(() => {
    loadOrganisation();
  }, [slug]);

  const loadOrganisation =
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
            .organisationReview(
              slug
            );

        setOrganisation(
          response?.organisation ||
            null
        );
      } catch (err) {
        setError(
          err?.message ||
            "Unable to load organisation application."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  const openModal = (
    type
  ) => {
    setActionError("");
    setReviewNotes(
      organisation?.review_notes ||
        ""
    );
    setModal(type);
  };

  const resetModal = () => {
    setModal(null);
    setReviewNotes("");
    setActionError("");
  };

  const handleApprove =
    async () => {
      try {
        setActionLoading(true);
        setActionError("");

        const response =
          await adminApi
            .approveOrganisation(
              slug,
              {
                review_notes:
                  reviewNotes.trim(),
              }
            );

        setOrganisation(
          response?.organisation ||
            organisation
        );

        setSuccessMessage(
          response?.message ||
            "Organisation approved successfully."
        );

        resetModal();
      } catch (err) {
        setActionError(
          err?.message ||
            "Unable to approve organisation."
        );
      } finally {
        setActionLoading(false);
      }
    };

  const handleRequestChanges =
    async () => {
      if (!reviewNotes.trim()) {
        setActionError(
          "Please explain the changes required."
        );
        return;
      }

      try {
        setActionLoading(true);
        setActionError("");

        const response =
          await adminApi
            .requestOrganisationChanges(
              slug,
              {
                review_notes:
                  reviewNotes.trim(),
              }
            );

        setOrganisation(
          response?.organisation ||
            organisation
        );

        setSuccessMessage(
          response?.message ||
            "Changes requested successfully."
        );

        resetModal();
      } catch (err) {
        setActionError(
          err?.message ||
            "Unable to request changes."
        );
      } finally {
        setActionLoading(false);
      }
    };

  const handleReject =
    async () => {
      if (!reviewNotes.trim()) {
        setActionError(
          "Please provide the reason for rejection."
        );
        return;
      }

      try {
        setActionLoading(true);
        setActionError("");

        const response =
          await adminApi
            .rejectOrganisation(
              slug,
              {
                review_notes:
                  reviewNotes.trim(),
              }
            );

        setOrganisation(
          response?.organisation ||
            organisation
        );

        setSuccessMessage(
          response?.message ||
            "Organisation rejected successfully."
        );

        resetModal();
      } catch (err) {
        setActionError(
          err?.message ||
            "Unable to reject organisation."
        );
      } finally {
        setActionLoading(false);
      }
    };

  if (loading) {
    return <LoadingState />;
  }

  if (
    error &&
    !organisation
  ) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-3xl border border-red-200 bg-white p-10 text-center">
          <AlertTriangle className="w-10 h-10 mx-auto text-red-500" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load application
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              loadOrganisation()
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#07505E] px-5 py-3 text-sm font-semibold text-white"
          >
            <RefreshCcw size={16} />

            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!organisation) {
    return null;
  }

  const creator =
    organisation.created_by;

  const status =
    organisation.approval_status;

  const canReview =
    status === "pending";

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Top actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <button
          type="button"
          onClick={() =>
            navigate(
              "/organisation-reviews"
            )
          }
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#07505E]"
        >
          <ArrowLeft size={17} />

          Back to Reviews
        </button>

        <button
          type="button"
          onClick={() =>
            loadOrganisation({
              showRefresh: true,
            })
          }
          disabled={refreshing}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCcw
            size={16}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      {successMessage && (
        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />

          <p className="text-sm font-medium text-green-700 flex-1">
            {successMessage}
          </p>

          <button
            type="button"
            onClick={() =>
              setSuccessMessage("")
            }
            className="text-green-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hero */}
      <section className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="relative h-44 sm:h-52 bg-gradient-to-br from-[#073B4C] via-[#07505E] to-[#6C994E]">

          {organisation.cover_image && (
            <>
              <img
                src={
                  organisation.cover_image
                }
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-[#073B4C]/60" />
            </>
          )}

          <div className="absolute top-5 right-5">
            <StatusBadge
              status={status}
            />
          </div>
        </div>

        <div className="px-5 sm:px-7 pb-7">
          <div className="-mt-12 relative flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div className="flex flex-col sm:flex-row sm:items-end gap-4">

              <div className="w-24 h-24 rounded-3xl border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center shrink-0">

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
                  <Building2 className="w-9 h-9 text-slate-400" />
                )}
              </div>

              <div className="pb-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#07505E]">
                  {organisation
                    .organisation_type_display ||
                    formatLabel(
                      organisation
                        .organisation_type
                    )}
                </p>

                <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-[#073B4C]">
                  {organisation.name}
                </h1>

                {organisation.tagline && (
                  <p className="mt-2 max-w-2xl text-sm text-slate-500">
                    {organisation.tagline}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main layout */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1.5fr_0.8fr] gap-6">

        {/* Left */}
        <div className="space-y-6">

          <SectionCard
            title="Organisation Overview"
            icon={Building2}
          >
            <TextSection
              label="Description"
              value={
                organisation.description
              }
            />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <TextSection
                label="Mission"
                value={
                  organisation.mission
                }
              />

              <TextSection
                label="Vision"
                value={
                  organisation.vision
                }
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Ecosystem Contribution"
            icon={Target}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              <ContentBlock
                icon={Target}
                title="What They Do"
                value={
                  organisation.what_we_do
                }
              />

              <ContentBlock
                icon={Lightbulb}
                title="What They Offer"
                value={
                  organisation.what_we_offer
                }
              />

              <ContentBlock
                icon={
                  CircleDollarSign
                }
                title="What They Need"
                value={
                  organisation.what_we_need
                }
              />

              <ContentBlock
                icon={Handshake}
                title="Partnership Interests"
                value={
                  organisation.partnership_interests
                }
              />
            </div>

            {organisation.how_to_engage && (
              <div className="mt-5">
                <ContentBlock
                  icon={
                    MessageSquareText
                  }
                  title="How to Engage"
                  value={
                    organisation.how_to_engage
                  }
                />
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Registration Information"
            icon={FileText}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <DetailItem
                label="Registration Number"
                value={
                  organisation.registration_number
                }
              />

              <DetailItem
                label="Year Established"
                value={
                  organisation.year_established
                }
              />

              <DetailItem
                label="Submitted"
                value={formatDateTime(
                  organisation.submitted_at ||
                    organisation.created_at
                )}
              />

              <DetailItem
                label="Last Updated"
                value={formatDateTime(
                  organisation.updated_at
                )}
              />
            </div>

            {organisation.registration_document && (
              <a
                href={
                  organisation.registration_document
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#07505E]/10 px-4 py-3 text-sm font-semibold text-[#07505E] hover:bg-[#07505E]/15"
              >
                <FileText size={17} />

                View Registration Document

                <ExternalLink size={15} />
              </a>
            )}
          </SectionCard>

          {organisation.review_notes && (
            <SectionCard
              title="Review Notes"
              icon={
                MessageSquareText
              }
            >
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm leading-7 text-amber-800 whitespace-pre-line">
                  {
                    organisation.review_notes
                  }
                </p>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Right */}
        <div className="space-y-6">

          <SectionCard
            title="Applicant"
            icon={UserRound}
          >
            {creator ? (
              <div>
                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">

                    {creator.profile_image ? (
                      <img
                        src={
                          creator.profile_image
                        }
                        alt={
                          creator.full_name
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserRound className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate">
                      {
                        creator.full_name
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatLabel(
                        creator.person_type
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">

                  <ContactItem
                    icon={Mail}
                    value={
                      creator.email
                    }
                  />

                  <ContactItem
                    icon={Phone}
                    value={
                      creator.phone
                    }
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Applicant information is not available.
              </p>
            )}
          </SectionCard>

          <SectionCard
            title="Contact & Location"
            icon={MapPin}
          >
            <div className="space-y-3">

              <ContactItem
                icon={MapPin}
                value={
                  organisation
                    .location
                    ?.name
                }
              />

              <ContactItem
                icon={MapPin}
                value={
                  organisation.address
                }
              />

              <ContactItem
                icon={Mail}
                value={
                  organisation.email
                }
              />

              <ContactItem
                icon={Phone}
                value={
                  organisation.phone
                }
              />

              {organisation.website && (
                <a
                  href={
                    organisation.website
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm text-[#07505E] hover:bg-slate-100"
                >
                  <Globe2 size={17} />

                  <span className="truncate flex-1">
                    {
                      organisation.website
                    }
                  </span>

                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Review Status"
            icon={ShieldCheck}
          >
            <StatusBadge
              status={status}
            />

            {organisation.approved_at && (
              <div className="mt-4 flex items-start gap-3 text-sm text-slate-500">
                <CalendarDays
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>
                  Reviewed{" "}
                  {formatDateTime(
                    organisation.approved_at
                  )}
                </span>
              </div>
            )}
          </SectionCard>

          {/* Decision */}
          {canReview && (
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6">

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F2B632]/15 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#D99A16]" />
                </div>

                <div>
                  <h2 className="font-bold text-[#073B4C]">
                    Make Decision
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Review the complete application before making a final decision.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">

                <button
                  type="button"
                  onClick={() =>
                    openModal(
                      "approve"
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#6C994E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5d8744] transition"
                >
                  <CheckCircle2 size={17} />

                  Approve Organisation
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openModal(
                      "changes"
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#F2B632] bg-[#F2B632]/10 px-4 py-3 text-sm font-semibold text-[#9a6a00] hover:bg-[#F2B632]/20 transition"
                >
                  <AlertTriangle size={17} />

                  Request Changes
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openModal(
                      "reject"
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
                >
                  <XCircle size={17} />

                  Reject Organisation
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <DecisionModal
          type={modal}
          notes={reviewNotes}
          setNotes={setReviewNotes}
          loading={actionLoading}
          error={actionError}
          onClose={() => {
            if (!actionLoading) {
              resetModal();
            }
          }}
          onConfirm={
            modal === "approve"
              ? handleApprove
              : modal === "changes"
              ? handleRequestChanges
              : handleReject
          }
        />
      )}
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-5">

        <div className="w-10 h-10 rounded-xl bg-[#07505E]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#07505E]" />
        </div>

        <h2 className="font-bold text-[#073B4C]">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function TextSection({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm leading-7 text-slate-600 whitespace-pre-line">
        {value ||
          "Not provided"}
      </p>
    </div>
  );
}

function ContentBlock({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#07505E]" />

        <p className="text-sm font-bold text-slate-700">
          {title}
        </p>
      </div>

      <p className="mt-3 text-sm leading-7 text-slate-500 whitespace-pre-line">
        {value ||
          "Not provided"}
      </p>
    </div>
  );
}

function DetailItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value ||
          "Not provided"}
      </p>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  value,
}) {
  if (!value) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-600">
      <Icon className="w-4 h-4 text-[#07505E] shrink-0" />

      <span className="truncate">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({
  status,
}) {
  const config = {
    pending: {
      label: "Pending Review",
      classes:
        "bg-amber-50 border-amber-200 text-amber-700",
      icon: Clock3,
    },

    approved: {
      label: "Approved",
      classes:
        "bg-green-50 border-green-200 text-green-700",
      icon: BadgeCheck,
    },

    changes_requested: {
      label:
        "Changes Requested",
      classes:
        "bg-orange-50 border-orange-200 text-orange-700",
      icon: AlertTriangle,
    },

    rejected: {
      label: "Rejected",
      classes:
        "bg-red-50 border-red-200 text-red-700",
      icon: XCircle,
    },

    draft: {
      label: "Draft",
      classes:
        "bg-slate-50 border-slate-200 text-slate-600",
      icon: FileText,
    },

    suspended: {
      label: "Suspended",
      classes:
        "bg-red-50 border-red-200 text-red-700",
      icon: XCircle,
    },
  };

  const item =
    config[status] ||
    config.pending;

  const Icon =
    item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${item.classes}`}
    >
      <Icon size={13} />

      {item.label}
    </span>
  );
}

function DecisionModal({
  type,
  notes,
  setNotes,
  loading,
  error,
  onClose,
  onConfirm,
}) {
  const content = {
    approve: {
      title:
        "Approve Organisation",
      description:
        "This organisation will become approved in the IGATI ecosystem.",
      button:
        "Confirm Approval",
      buttonClass:
        "bg-[#6C994E] hover:bg-[#5d8744]",
      icon: CheckCircle2,
      iconClass:
        "bg-green-50 text-green-600",
      required: false,
    },

    changes: {
      title:
        "Request Changes",
      description:
        "Explain what the organisation needs to correct before it can be approved.",
      button:
        "Send Change Request",
      buttonClass:
        "bg-[#D99A16] hover:bg-[#bd8411]",
      icon: AlertTriangle,
      iconClass:
        "bg-amber-50 text-amber-600",
      required: true,
    },

    reject: {
      title:
        "Reject Organisation",
      description:
        "Provide a clear reason for rejecting this application.",
      button:
        "Confirm Rejection",
      buttonClass:
        "bg-red-600 hover:bg-red-700",
      icon: XCircle,
      iconClass:
        "bg-red-50 text-red-600",
      required: true,
    },
  };

  const item =
    content[type];

  const Icon =
    item.icon;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">

        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">

          <div className="flex gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconClass}`}
            >
              <Icon size={20} />
            </div>

            <div>
              <h2 className="font-bold text-lg text-[#073B4C]">
                {item.title}
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {
                  item.description
                }
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-5 sm:p-6">

          <label className="block text-sm font-semibold text-slate-700">
            Review Notes
            {item.required && (
              <span className="text-red-500">
                {" "}*
              </span>
            )}
          </label>

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
            rows={5}
            placeholder={
              type === "approve"
                ? "Optional notes about this approval..."
                : type === "changes"
                ? "Explain what needs to be changed..."
                : "Explain why this organisation is being rejected..."
            }
            className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#07505E] focus:ring-4 focus:ring-[#07505E]/10"
          />

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={
                onConfirm
              }
              disabled={loading}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${item.buttonClass}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Icon size={16} />
                  {item.button}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">

      <div className="text-center">
        <Loader2 className="w-9 h-9 animate-spin text-[#07505E] mx-auto" />

        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading organisation application...
        </p>
      </div>
    </div>
  );
}

function formatLabel(
  value
) {
  if (!value) return "";

  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );
}

function formatDateTime(
  value
) {
  if (!value) {
    return "Not available";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not available";
  }

  return date.toLocaleString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}