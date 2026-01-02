"use client";

import { useState, useEffect, useTransition, useMemo, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import { DgtResponse } from "@/app/types/dgt";
import { getAllDgtData } from "@/app/actions/dgt";

const DgtMap = dynamic(() => import("@/components/dgt-map-optimized").then(mod => ({ default: mod.DgtMap })), {
  loading: () => <MapSkeleton />,
  ssr: false,
});

const IncidentCard = lazy(() => import("@/components/incident-card").then(mod => ({ default: mod.IncidentCard })));

interface DgtDashboardProps {
  initialData?: DgtResponse;
}

function MapSkeleton() {
  return (
    <div className="h-[600px] w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 mb-8 animate-pulse" />
  );
}

function IncidentCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-pulse">
      <div>
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-700 rounded mb-1" />
        <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded" />
      </div>
    </div>
  );
}

export function DgtDashboard({ initialData }: DgtDashboardProps) {
  const [data, setData] = useState<DgtResponse | undefined>(initialData);
  const [isPending, startTransition] = useTransition();

  const activeIncidents = useMemo(() => {
    if (!data) return [];
    return data.situationsRecords.filter(
      (st) => st.fuente === "DGT3.0" || st.subcausa === "Vehículo detenido"
    );
  }, [data]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        startTransition(async () => {
          try {
            const newData = await getAllDgtData();
            if (newData) {
              setData(newData);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        });
      }, 10000);

      return () => clearInterval(interval);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">
          No se pudieron cargar los datos de tráfico.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 font-sans dark:bg-black sm:p-8">
      <main className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Incidencias de Tráfico DGT 3.0
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Estado de las carreteras en tiempo real. {activeIncidents.length}{" "}
            Balizas V16 activas.
          </p>
        </header>

        <DgtMap situations={activeIncidents} />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Suspense fallback={Array.from({ length: 8 }).map((_, i) => (
            <IncidentCardSkeleton key={i} />
          ))}>
            {activeIncidents.map((situation) => (
              <IncidentCard key={situation.situationId} situation={situation} />
            ))}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
