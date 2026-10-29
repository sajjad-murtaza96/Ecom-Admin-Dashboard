import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CalendarDays, CircleCheck, CircleX, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { getUser } from "@/db/supabase/query";
import { ProfileForm } from "./components/profile-form";

export const metadata: Metadata = {
  title: "My Profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const { data: { user }, error } = await getUser();
  if (error || !user) redirect("/login");

  const fullName = typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : typeof user.user_metadata.name === "string" ? user.user_metadata.name : "";
  const phone = typeof user.user_metadata.phone === "string" ? user.user_metadata.phone : user.phone ?? "";
  const initials = fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => Array.from(part)[0]).join("").toUpperCase();
  const memberSince = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(user.created_at));

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="border-b border-gray-200 pb-8">
          <h1 className="text-2xl font-semibold sm:text-3xl">My Profile</h1>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
            <div className="flex min-w-0 max-w-full items-center gap-4 sm:gap-5">
              <div aria-hidden="true" className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-2xl font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-100">
                {initials || <UserRound className="h-8 w-8" />}
                {user.email_confirmed_at && <span className="absolute bottom-0 right-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white ring-4 ring-white"><CircleCheck className="h-4 w-4" /></span>}
              </div>
              <div className="min-w-0">
                <p className="break-words text-xl font-semibold leading-7">{fullName || "Your account"}</p>
                <p className="mt-1 break-all text-sm text-gray-500">{user.email || user.phone}</p>
                <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-gray-500"><CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /> Member since {memberSince}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="grid items-start gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <section aria-labelledby="profile-personal-heading" className="min-w-0">
            <h2 id="profile-personal-heading" tabIndex={-1} className="flex scroll-mt-8 items-center gap-2 text-base font-semibold focus:outline-none"><UserRound aria-hidden="true" className="h-5 w-5 text-indigo-500" /> Personal Details</h2>
            <ProfileForm fullName={fullName} phone={phone} />
          </section>
          <aside className="min-w-0 border-t border-gray-200 pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <section aria-labelledby="profile-account-heading">
              <h2 id="profile-account-heading" className="flex items-center gap-2 text-base font-semibold"><ShieldCheck aria-hidden="true" className="h-5 w-5 text-emerald-600" /> Account Details</h2>
              <dl className="mt-6 divide-y divide-gray-100 text-sm">
                <div className="pb-5">
                  <dt className="flex items-center gap-2 text-gray-500"><Mail aria-hidden="true" className="h-4 w-4" /> Email address</dt>
                  <dd className="mt-2 break-all font-medium">{user.email || "Not provided"}</dd>
                  {user.email && <dd className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.email_confirmed_at ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15" : "bg-amber-50 text-amber-700 ring-amber-600/15"}`}>{user.email_confirmed_at ? <CircleCheck aria-hidden="true" className="h-3.5 w-3.5" /> : <CircleX aria-hidden="true" className="h-3.5 w-3.5" />}{user.email_confirmed_at ? "Verified email" : "Not verified"}</dd>}
                </div>
                <div className="py-5">
                  <dt className="flex items-center gap-2 text-gray-500"><Phone aria-hidden="true" className="h-4 w-4" /> Phone number</dt>
                  <dd className="mt-2 break-words font-medium tabular-nums">{phone.trim() || "Not provided"}</dd>
                  {user.phone && <dd className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.phone_confirmed_at ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15" : "bg-amber-50 text-amber-700 ring-amber-600/15"}`}>{user.phone_confirmed_at ? <CircleCheck aria-hidden="true" className="h-3.5 w-3.5" /> : <CircleX aria-hidden="true" className="h-3.5 w-3.5" />}{user.phone_confirmed_at ? "Verified phone" : "Not verified"}</dd>}
                </div>
                <div className="py-5">
                  <dt className="text-gray-500">Sign-in method</dt>
                  <dd className="mt-2 break-words font-medium">{Array.from(new Set((user.identities ?? []).map((identity) => identity.provider === "email" ? "Email and password" : identity.provider.charAt(0).toUpperCase() + identity.provider.slice(1)))).join(", ") || "Not available"}</dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}