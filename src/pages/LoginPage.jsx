import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  LogIn,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.identifier.trim()) {
      setError(
        "Please enter your username or email."
      );
      return;
    }

    if (!form.password) {
      setError(
        "Please enter your password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            identifier:
              form.identifier.trim(),
            password: form.password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.detail ||
            data?.error ||
            "Invalid login credentials."
        );
      }

      const user = data?.user;

      if (!user) {
        throw new Error(
          "User information was not returned by the server."
        );
      }
      /*
       * Only allow platform admins or staff
       * into the admin portal.
       */
      const allowed =
        user.role === "admin" ||
        user.role === "staff";

      if (!allowed) {
        throw new Error(
          "You do not have permission to access the IGATI administration portal."
        );
      }

      if (!user.is_active) {
        throw new Error(
          "Your account is inactive."
        );
      }

      if (!data.tokens?.access) {
        throw new Error(
          "Access token was not returned by the server."
        );
      }

      localStorage.setItem(
        "access_token",
        data.tokens.access
      );

      if (data.tokens.refresh) {
        localStorage.setItem(
          "refresh_token",
          data.tokens.refresh
        );
      }

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#F8FAF7] flex">

      {/* Left branding */}
      <div
        className="
          hidden
          lg:flex
          lg:w-[48%]
          xl:w-[52%]
          relative
          overflow-hidden
          bg-[#073B4C]
          text-white
        "
      >
        {/* Decorations */}
        <div className="absolute -top-32 -left-32 w-[380px] h-[380px] rounded-full bg-[#6C994E]/20 blur-3xl" />

        <div className="absolute -bottom-32 -right-20 w-[420px] h-[420px] rounded-full bg-[#F2B632]/10 blur-3xl" />

        <div className="relative z-10 w-full flex flex-col justify-between p-10 xl:p-14">

          {/* Brand */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg">
              <span className="text-[#073B4C] font-black text-2xl">
                I
              </span>
            </div>

            <div>
              <h1 className="font-bold text-xl">
                IGATI
              </h1>

              <p className="text-sm text-white/60">
                Global Mission Network
              </p>
            </div>
          </div>

          {/* Main message */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm font-semibold text-white/80">
              <ShieldCheck className="w-4 h-4 text-[#F2B632]" />
              Administration Portal
            </div>

            <h2 className="mt-6 text-4xl xl:text-5xl font-bold leading-tight">
              Manage the IGATI
              <span className="block text-[#F2B632]">
                ecosystem.
              </span>
            </h2>

            <p className="mt-6 text-base xl:text-lg leading-8 text-white/70">
              Review organisations,
              manage ecosystem members,
              monitor projects,
              opportunities, knowledge,
              marketplace activity and
              community impact from one
              administration platform.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Feature>
                Organisation approvals
              </Feature>

              <Feature>
                People management
              </Feature>

              <Feature>
                Ecosystem projects
              </Feature>

              <Feature>
                Marketplace oversight
              </Feature>
            </div>
          </div>

          {/* Footer */}
          <div>
            <p className="text-xs text-white/40">
              IGATI Global Mission Network
            </p>

            <p className="mt-1 text-xs text-white/30">
              Meru, Kenya
            </p>
          </div>
        </div>
      </div>

      {/* Login side */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">

        <div className="w-full max-w-md">

          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-[#073B4C] flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xl">
                I
              </span>
            </div>

            <div>
              <p className="font-bold text-[#073B4C]">
                IGATI
              </p>

              <p className="text-xs text-slate-500">
                Administration Portal
              </p>
            </div>
          </div>

          {/* Heading */}
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#07505E]/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#07505E]" />
            </div>

            <h1 className="mt-5 text-3xl font-bold text-[#073B4C]">
              Welcome back
            </h1>

            <p className="mt-2 text-slate-500 leading-6">
              Sign in with your authorised
              IGATI administrator or staff
              account.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />

              <p className="text-sm text-red-700 leading-6">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Identifier */}
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-semibold text-slate-800"
              >
                Username or Email
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  id="identifier"
                  type="text"
                  name="identifier"
                  value={form.identifier}
                  onChange={handleChange}
                  autoComplete="username"
                  placeholder="Enter username or email"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    pl-11
                    pr-4
                    py-3.5
                    text-slate-900
                    outline-none
                    transition
                    focus:border-[#07505E]
                    focus:ring-4
                    focus:ring-[#07505E]/10
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Password
                </label>
              </div>

              <div className="relative mt-2">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    pl-11
                    pr-12
                    py-3.5
                    text-slate-900
                    outline-none
                    transition
                    focus:border-[#07505E]
                    focus:ring-4
                    focus:ring-[#07505E]/10
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#07505E]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-[#07505E]
                text-white
                py-3.5
                px-5
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition
                hover:bg-[#073B4C]
                disabled:opacity-60
                disabled:cursor-not-allowed
                shadow-sm
              "
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-[#6C994E] shrink-0 mt-0.5" />

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Restricted access
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  This portal is intended
                  only for authorised IGATI
                  administrators and staff.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            IGATI Global Mission Network
            Administration Portal
          </p>
        </div>
      </div>
    </section>
  );
}

function Feature({ children }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
      <div className="w-2 h-2 rounded-full bg-[#F2B632] shrink-0" />

      <span className="text-sm text-white/75">
        {children}
      </span>
    </div>
  );
}