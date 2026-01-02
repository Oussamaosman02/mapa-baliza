import { getAllDgtData } from "./actions/dgt";
import { DgtDashboard } from "@/components/dgt-dashboard-optimized";
import { Suspense } from "react";

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 p-4 font-sans dark:bg-black sm:p-8">
      <main className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="h-9 w-96 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-6 w-64 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </header>
        <div className="h-[600px] w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 mb-8 animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 animate-pulse" />
          ))}
        </div>
      </main>
    </div>
  );
}

export default async function Home() {
  const data = await getAllDgtData();

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DgtDashboard initialData={data} />
    </Suspense>
  );
}

