import { LoaderCircle } from "lucide-react";

export const Loader = () => {
	return (
		<div role="status" aria-busy="true" className="flex min-h-48 w-full flex-col items-center justify-center gap-4 px-4 py-10 text-center">
			<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50">
				<LoaderCircle aria-hidden="true" className="h-6 w-6 animate-spin text-indigo-600 motion-reduce:animate-none" />
			</div>
			<p className="text-sm font-medium leading-6 text-gray-600">Loading payment method...</p>
		</div>
	);
}
