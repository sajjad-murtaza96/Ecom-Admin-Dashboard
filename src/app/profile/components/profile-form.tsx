"use client";
import { useActionState, useState } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, Phone, RotateCcw, Save, UserRound } from "lucide-react";
import { updateProfileAction, type ProfileState } from "@/app/actions/profile";

const inputClassName = "block min-h-12 w-full min-w-0 rounded-md border border-gray-300 bg-white py-3 pl-11 pr-3 text-sm text-gray-900 transition-colors hover:border-gray-400 focus:border-indigo-500 focus:bg-indigo-50/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 motion-reduce:transition-none";

export function ProfileForm({ fullName, phone }: { fullName: string; phone: string }) {
  const [savedValues, setSavedValues] = useState({ fullName, phone });
  const [values, setValues] = useState({ fullName, phone });
  const dirty = values.fullName.trim() !== savedValues.fullName.trim() || values.phone.trim() !== savedValues.phone.trim();
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(async (previousState, formData) => {
    const result = await updateProfileAction(previousState, formData);
    if (result.success) {
      const updatedValues = {
        fullName: String(formData.get("fullName") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
      };
      setSavedValues(updatedValues);
      setValues(updatedValues);
    }
    return result;
  }, {});

  return (
    <form action={formAction} className="mt-6 max-w-xl space-y-6" aria-busy={pending}>
      <div className="group">
        <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 transition-colors group-focus-within:text-indigo-600 motion-reduce:transition-none">Full name</label>
        <div className="relative mt-2">
          <UserRound aria-hidden="true" className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-indigo-600 motion-reduce:transition-none" />
          <input id="profile-name" name="fullName" autoComplete="name" value={values.fullName} onChange={(event) => setValues({ ...values, fullName: event.target.value })} required maxLength={100} disabled={pending} className={inputClassName} />
        </div>
      </div>
      <div className="group">
        <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 transition-colors group-focus-within:text-indigo-600 motion-reduce:transition-none">Contact phone <span className="font-normal text-gray-400">(optional)</span></label>
        <div className="relative mt-2">
          <Phone aria-hidden="true" className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-indigo-600 motion-reduce:transition-none" />
          <input id="profile-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} maxLength={40} disabled={pending} className={inputClassName} />
        </div>
      </div>
      {state.error && <p role="alert" className="flex items-start gap-2 rounded-md border border-red-100 bg-red-50 px-3 py-2.5 text-sm leading-6 text-red-700"><CircleAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />{state.error}</p>}
      {state.success && !dirty && <p role="status" className="flex items-start gap-2 rounded-md border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-sm leading-6 text-emerald-700"><CircleCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />{state.success}</p>}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5">
        <p role="status" className={`flex items-center gap-2 text-xs font-medium ${dirty ? "text-amber-700" : "text-gray-500"}`}>
          {dirty ? <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-500" /> : <CircleCheck aria-hidden="true" className="h-3.5 w-3.5" />}
          {pending ? "Saving changes" : dirty ? "Unsaved changes" : "Up to date"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setValues(savedValues)} title="Discard changes" aria-label="Discard changes" disabled={pending || !dirty} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"><RotateCcw aria-hidden="true" className="h-4 w-4" /></button>
          <button type="submit" disabled={pending || !dirty || !values.fullName.trim()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 active:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 motion-reduce:transition-none">
            {pending ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : <Save aria-hidden="true" className="h-4 w-4" />}
            {pending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}