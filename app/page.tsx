import { getAllDgtData } from "./actions/dgt";
import { DgtDashboard } from "@/components/dgt-dashboard-optimized";

export default async function Home() {
  const data = await getAllDgtData();

  return <DgtDashboard initialData={data} />;
}

