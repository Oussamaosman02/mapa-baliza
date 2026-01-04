"use server";

import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export interface GeolocationData {
  country: string;
  countryName: string;
  region: string;
  regionName: string;
  city: string;
  ip: string;
}

export async function getVisitorLocation(
  headersList: ReadonlyHeaders
): Promise<GeolocationData | null> {
  try {
    // Try to get IP from various headers
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      headersList.get("cf-connecting-ip") ||
      "8.8.8.8"; // Fallback for development

    // Use ipapi.co free API (no key required, 1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Failed to fetch geolocation data");
      return null;
    }

    const data = await response.json();

    return {
      country: data.country_code || "Unknown",
      countryName: data.country_name || "Unknown",
      region: data.region_code || "Unknown",
      regionName: data.region || "Unknown",
      city: data.city || "Unknown",
      ip: ip,
    };
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return null;
  }
}
