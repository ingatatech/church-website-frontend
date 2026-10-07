import { notFound } from "next/navigation";
import type { AdminContentSection } from "@/lib/content/admin-content";
import { AdminRecordManager } from "@/components/admin/management/admin-record-manager";
import { InquiryManager } from "@/components/admin/management/inquiry-manager";
import { MediaLibraryManager } from "@/components/admin/management/media-library-manager";
import { AnnouncementManager } from "@/components/admin/management/announcement-manager";

type RecordSection = "sermons" | "events" | "ministries" | "resources" | "leadership" | "settings";

export function AdminContentPage({ section }: { section: AdminContentSection }) {
  if (section === "media") return <MediaLibraryManager />;
  if (section === "announcements") return <AnnouncementManager />;
  if (section === "inquiries" || section === "prayer-requests") return <InquiryManager section={section} />;
  if (["sermons", "events", "ministries", "resources", "leadership", "settings"].includes(section)) {
    return <AdminRecordManager section={section as RecordSection} />;
  }
  notFound();
}
