import { DgtSituation } from "@/app/types/dgt";
import { memo } from "react";

interface IncidentCardProps {
  situation: DgtSituation;
}

export const IncidentCard = memo(function IncidentCard({
  situation,
}: IncidentCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
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
            {situation.municipioIni}
            {situation.provinciaIni && `, ${situation.provinciaIni}`}
          </span>
          <span className="shrink-0 text-xs text-zinc-500">
            {new Date(situation.fechaInicio).toLocaleDateString("es-ES")}
          </span>
        </div>

        <h2 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Vía: {situation.carretera || "Vía desconocida"}
        </h2>

        <div className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-900 dark:text-zinc-200">
            {situation.subcausa}
          </span>
          {situation.pkIni && (
            <span className="ml-1 block text-xs text-zinc-500">
              Punto Kilométrico: {situation.pkIni}{" "}
              {situation.pkFin ? `-${situation.pkFin}` : ""}
            </span>
          )}
        </div>

        <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <p className="line-clamp-2" title={situation.subtipoVialidad}>
            Tipo: {situation.subtipoVialidad}
          </p>
          <p>
            Población: {situation.municipioIni}
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
              <span className="font-medium text-zinc-500">Sentido:</span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {situation.sentido === "positive"
                  ? "Creciente"
                  : situation.sentido === "negative"
                  ? "Decreciente"
                  : situation.sentido === "both"
                  ? "Bidireccional"
                  : situation.sentido}
              </span>
            </div>
          )}
        </div>
      )}
    </article>
  );
});
