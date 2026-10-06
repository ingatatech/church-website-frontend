import type { Metadata } from "next";
import { DashboardView } from "../../../src/views/admin/dashboard-view";

export const metadata: Metadata = {
  title: "Dashboard overview",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return <DashboardView />;
}
