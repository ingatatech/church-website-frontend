import type { Metadata } from "next";
import { AdminContentPage } from "@/components/admin/admin-content-page";

export const metadata: Metadata = { title: "Settings", robots: { index: false, follow: false } };

export default function AdminSettingsPage() {
  return <AdminContentPage section="settings" />;
}
