export const adminSections = [
  ["Dashboard", "/admin/dashboard"],
  ["Sermons", "/admin/sermons"],
  ["Events", "/admin/events"],
  ["Ministries", "/admin/ministries"],
  ["Announcements", "/admin/announcements"],
  ["Resources", "/admin/resources"],
  ["Leadership", "/admin/leadership"],
  ["Media library", "/admin/media"],
  ["Inquiries", "/admin/inquiries"],
  ["Prayer requests", "/admin/prayer-requests"],
  ["Settings", "/admin/settings"],
] as const;

export type AdminContentSection =
  | "sermons"
  | "events"
  | "ministries"
  | "announcements"
  | "resources"
  | "leadership"
  | "media"
  | "inquiries"
  | "prayer-requests"
  | "settings";
