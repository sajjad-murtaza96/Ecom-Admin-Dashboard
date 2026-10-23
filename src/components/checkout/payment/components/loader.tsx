export const Loader = () => {
    return (
        <div role="status" aria-busy="true" className="flex min-h-48 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
            <span className="sr-only">Loading payment methods...</span>
            <div aria-hidden="true" className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600 motion-reduce:animate-none" />
        </div>
    );
}
