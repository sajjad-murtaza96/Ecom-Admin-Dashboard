export function CartSkeleton() {
  return (
    <div role="status" aria-busy="true">
      <div
        aria-hidden="true"
        className="mt-8 grid animate-pulse items-start gap-10 motion-reduce:animate-none lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16"
      >
        <div className="min-w-0">
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex min-w-0 gap-4 py-6 sm:gap-6">
                <div className="h-24 w-24 shrink-0 rounded-md bg-gray-200 sm:h-32 sm:w-32" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-20 rounded bg-gray-200" />
                  <div className="flex flex-wrap justify-between gap-3 pt-2">
                    <div className="h-10 w-36 rounded-md bg-gray-200" />
                    <div className="h-5 w-16 rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 h-5 w-40 rounded bg-gray-200" />
        </div>
        <div className="min-w-0 border-t border-gray-200 pt-6">
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex justify-between gap-4">
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
              </div>
            ))}
            <div className="flex justify-between gap-4 border-t border-gray-200 pt-4">
              <div className="h-5 w-28 rounded bg-gray-200" />
              <div className="h-5 w-20 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
