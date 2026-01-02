"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import dynamic from "next/dynamic";
import { DgtResponse } from "@/app/types/dgt";
import { getAllDgtData } from "@/app/actions/dgt";

const DgtMap = dynamic(() => import("@/components/dgt-map-optimized").then(mod => ({ default: mod.DgtMap })), {
  loading: () => <MapSkeleton />,
  ssr: false,
});

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
    }, 5000);

    return () => clearInterval(interval);
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
          {isPending && activeIncidents.length === 0 ? (
            Array.from({ length: 8 }).map((_, i) => (
              <IncidentCardSkeleton key={i} />
            ))
          ) : (
            activeIncidents.map((situation) => (
              <article
                key={situation.situationId}
                className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        situation.causa === "Obras"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500"
                          : situation.causa === "Accidente"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500"
                      }`}
                    >
                      {situation.causa}
                    </span>
                    <span className="shrink-0 text-xs text-zinc-500">
                      {new Date(situation.fechaInicio).toLocaleDateString(
                        "es-ES"
                      )}
                    </span>
                  </div>

                  <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {situation.carretera || "Vía desconocida"}
                  </h2>

                  <div className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="font-medium text-zinc-900 dark:text-zinc-200">
                      {situation.subcausa}
                    </span>
                    {situation.pkIni && (
                      <span className="ml-1 block text-xs text-zinc-500">
                        PK {situation.pkIni} - {situation.pkFin}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <p className="line-clamp-2" title={situation.subtipoVialidad}>
                      {situation.subtipoVialidad}
                    </p>
                    <p>
                      {situation.municipioIni}
                      {situation.provinciaIni && `, ${situation.provinciaIni}`}
                    </p>
                  </div>
                </div>

                {(situation.hacia || situation.sentido) && (
                  <div className="mt-4 border-t border-zinc-100 pt-3 text-xs dark:border-zinc-800">
                    {situation.hacia && (
                      <div className="flex gap-1">
                        <span className="font-medium text-zinc-500">Hacia:</span>
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {situation.hacia}
                        </span>
                      </div>
                    )}
                    {situation.sentido && (
                      <div className="flex gap-1">
                        <span className="font-medium text-zinc-500">
                          Sentido:
                        </span>
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {situation.sentido === "positive"
                            ? "Creciente"
                            : situation.sentido === "negative"
                            ? "Decreciente"
                            : situation.sentido}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
