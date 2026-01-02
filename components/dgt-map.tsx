"use client";

import { DgtSituation } from "@/app/types/dgt";
import { Card } from "@/components/ui/card";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from "@/components/ui/map";
import { useMemo } from "react";

interface DgtMapProps {
  situations: DgtSituation[];
}

export function DgtMap({ situations }: DgtMapProps) {
  const markers = useMemo(() => {
    return situations
      .map((situation) => {
        try {
          if (!situation.geometria) return null;

          const geometry = JSON.parse(situation.geometria);
          let coordinates: [number, number] | null = null;

          if (geometry.type === "Point") {
            coordinates = geometry.coordinates;
          } else if (geometry.type === "LineString") {
            // Use the first coordinate for the marker
            coordinates = geometry.coordinates[0];
          }

          if (!coordinates) return null;

          return {
            ...situation,
            coordinates,
          };
        } catch (e) {
          return null;
        }
      })
      .filter(
        (s): s is DgtSituation & { coordinates: [number, number] } => s !== null
      );
  }, [situations]);

  return (
    <Card className="h-[600px] w-full overflow-hidden border-zinc-200 dark:border-zinc-800 p-0 mb-8">
      <Map
        center={[-3.7038, 40.4168]} // Center of Spain
        zoom={6}
        styles={{
          light: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
          dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
        }}
      >
        <MapControls />
        {markers.map((situation) => (
          <MapMarker
            key={situation.situationId}
            longitude={situation.coordinates[0]}
            latitude={situation.coordinates[1]}
          >
            <MarkerContent>
              <div
                className={`size-4 rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-110 ${
                  situation.causa === "Obras"
                    ? "bg-yellow-500"
                    : situation.causa === "Accidente"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              />
            </MarkerContent>
            <MarkerPopup>
              <div className="space-y-2 min-w-[200px] p-2 text-xs">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-1 mb-2">
                  Baliza activa
                </h3>

                <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium text-zinc-900 dark:text-zinc-200">
                    Carretera:
                  </span>
                  <span>{situation.carretera || "Desconocida"}</span>

                  {situation.pkIni && (
                    <>
                      <span className="font-medium text-zinc-900 dark:text-zinc-200">
                        PK:
                      </span>
                      <span>{situation.pkIni}</span>
                    </>
                  )}

                  {situation.sentido && (
                    <>
                      <span className="font-medium text-zinc-900 dark:text-zinc-200">
                        Sentido:
                      </span>
                      <span>
                        {situation.sentido === "positive"
                          ? "Creciente"
                          : situation.sentido === "negative"
                          ? "Decreciente"
                          : situation.sentido}
                      </span>
                    </>
                  )}

                  {situation.orientacion && (
                    <>
                      <span className="font-medium text-zinc-900 dark:text-zinc-200">
                        Orientación:
                      </span>
                      <span>
                        {situation.orientacion === "northBound"
                          ? "Norte"
                          : situation.orientacion === "southBound"
                          ? "Sur"
                          : situation.orientacion === "eastBound"
                          ? "Este"
                          : situation.orientacion === "westBound"
                          ? "Oeste"
                          : situation.orientacion === "northEastBound"
                          ? "Noreste"
                          : situation.orientacion === "northWestBound"
                          ? "Noroeste"
                          : situation.orientacion === "southEastBound"
                          ? "Sureste"
                          : situation.orientacion === "southWestBound"
                          ? "Suroeste"
                          : situation.orientacion}
                      </span>
                    </>
                  )}

                  <span className="font-medium text-zinc-900 dark:text-zinc-200">
                    Desde:
                  </span>
                  <span>
                    {new Date(situation.fechaInicio).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>

                  {situation.cAutonomaIni && (
                    <>
                      <span className="font-medium text-zinc-900 dark:text-zinc-200">
                        Comunidad:
                      </span>
                      <span>{situation.cAutonomaIni}</span>
                    </>
                  )}

                  {situation.provinciaIni && (
                    <>
                      <span className="font-medium text-zinc-900 dark:text-zinc-200">
                        Provincia:
                      </span>
                      <span>{situation.provinciaIni}</span>
                    </>
                  )}

                  {situation.municipioIni && (
                    <>
                      <span className="font-medium text-zinc-900 dark:text-zinc-200">
                        Municipio:
                      </span>
                      <span>{situation.municipioIni}</span>
                    </>
                  )}
                </div>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </Card>
  );
}
