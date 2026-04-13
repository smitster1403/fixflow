import { getDashboardStats } from "./actions";
import { OverviewContent } from "./overview-content";

export default async function DashboardPage() {
  let stats;
  try {
    stats = await getDashboardStats();
  } catch {
    stats = null;
  }

  return <OverviewContent stats={stats} />;
}
