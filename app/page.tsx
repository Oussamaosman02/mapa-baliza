import { getVisitorLocation } from "@/app/actions/geolocation";
import { DgtDashboard } from "@/components/dgt-dashboard-optimized";
import { headers } from "next/headers";

export default async function Home() {
  const headersList = await headers();
  const location = await getVisitorLocation(headersList);
  return <DgtDashboard initialData={undefined} location={location} />;
}
