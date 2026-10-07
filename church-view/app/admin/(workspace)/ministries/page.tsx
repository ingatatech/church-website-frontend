import type { Metadata } from "next";
import { AdminContentPage } from "@/components/admin/admin-content-page";

export const metadata: Metadata = { title: "Ministries", robots: { index: false, follow: false } };

export default function AdminMinistriesPage() {
  return <AdminContentPage section="ministries" />;
}
