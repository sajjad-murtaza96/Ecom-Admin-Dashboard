"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, CircleAlert, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { login, loginWithGoogle } from "@/app/actions/login";
import { Users } from "@/utilities/input-validator";
import { useUserReducer } from "@/reducers/user/user.hook";
import { ProductImage } from "@/components/product-image";

const inputClassName =
  "mt-2 block min-h-12 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 aria-invalid:border-red-400 aria-invalid:focus:ring-red-500/20";

export const LoginForm: React.FC<{ errorMessage?: string }> = ({ errorMessage }) => {
  const {
    state: { user, error, loading },
    addUser,
    startLoading,
    showError,
  } = useUserReducer();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startLoading();
    if (!user.name && !user.password) {
      showError("Email and Password are required");
      return;
    }
    const result = Users.safeParse(user);
    if (!result.success) {
      showError(result.error.issues[0].message);
      return;
    }
    await login(user).then((res) => {
      if (res) showError(res);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    addUser({ ...user, [name]: value });
  };
  return (
    <section aria-labelledby="login-heading" className="min-w-0 tracking-normal">
        <header className="mb-8">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-inset ring-indigo-100">
            <LockKeyhole aria-hidden="true" className="h-6 w-6" />
          </div>
          <h1 id="login-heading" className="text-3xl font-semibold leading-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">Sign in to your Electron account.</p>
        </header>

        {errorMessage && (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
            <CircleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="min-w-0 break-words">{errorMessage}</p>
          </div>
        )}
        <form action={loginWithGoogle}>
          <GoogleSignInButton />
        </form>
        <div className="my-7 flex items-center gap-4 text-xs font-medium text-gray-500">
          <div aria-hidden="true" className="h-px flex-1 bg-gray-200" />
          <span className="shrink-0">Or continue with email</span>
          <div aria-hidden="true" className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" aria-busy={loading}>
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="login-email"
              name="name"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              disabled={loading}
              aria-invalid={!!error}
              aria-describedby={error ? "login-error" : undefined}
              value={user.name}
              onChange={(e) => handleChange(e)}
              className={inputClassName}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                disabled={loading}
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
                value={user.password}
                onChange={(e) => handleChange(e)}
                className={`${inputClassName} pr-14`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center rounded-lg text-gray-400 transition-colors hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="h-5 w-5" />
                ) : (
                  <Eye aria-hidden="true" className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error ? (
            <div id="login-error" role="alert" className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">
              <CircleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="min-w-0 break-words">{error}</p>
            </div>
          ) : null}

          <button
            type="submit"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 active:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : null}
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
          </button>
        </form>

    </section>
  );
};

function GoogleSignInButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <LoaderCircle aria-hidden="true" className="h-5 w-5 shrink-0 animate-spin motion-reduce:animate-none" /> : <ProductImage
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt=""
        aria-hidden="true"
        width={20}
        height={20}
        unoptimized
        className="shrink-0"
      />}
      {pending ? "Connecting..." : "Continue with Google"}
    </button>
  );
}
