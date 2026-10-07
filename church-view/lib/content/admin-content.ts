export const adminSections = [
  ["Dashboard", "/admin/dashboard"], ["Sermons", "/admin/sermons"], ["Events", "/admin/events"],
  ["Ministries", "/admin/ministries"], ["Announcements", "/admin/announcements"],
  ["Resources", "/admin/resources"], ["Leadership", "/admin/leadership"],
  ["Media library", "/admin/media"], ["Inquiries", "/admin/inquiries"],
  ["Prayer requests", "/admin/prayer-requests"], ["Settings", "/admin/settings"],
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

export const adminContent: Record<AdminContentSection, { title: string; description: string; columns: string[]; records: string[][] }> = {
  sermons: { title: "Sermons", description: "Manage published messages and media details.", columns: ["TITLE", "SPEAKER", "DATE", "STATUS"], records: [["Room to grow", "Pastoral team", "Draft", "Draft"], ["Faith in community", "Pastoral team", "Draft", "Draft"]] },
  events: { title: "Events", description: "Keep the church calendar and event details up to date.", columns: ["EVENT", "DATE", "LOCATION", "STATUS"], records: [["Sunday gathering", "To be confirmed", "Kigali", "Draft"]] },
  ministries: { title: "Ministries", description: "Manage ministry descriptions, contacts and schedules.", columns: ["MINISTRY", "LEADER", "SCHEDULE", "STATUS"], records: [["Children’s ministry", "Not assigned", "To be confirmed", "Draft"], ["Youth ministry", "Not assigned", "To be confirmed", "Draft"]] },
  announcements: { title: "Announcements", description: "Publish community news and church updates.", columns: ["TITLE", "CATEGORY", "UPDATED", "STATUS"], records: [["Welcome to our church", "Community", "—", "Draft"]] },
  resources: { title: "Resources", description: "Organize documents, guides and helpful links.", columns: ["RESOURCE", "TYPE", "UPDATED", "STATUS"], records: [["Church welcome guide", "Document", "—", "Draft"]] },
  leadership: { title: "Leadership", description: "Maintain approved leader biographies and ministry roles.", columns: ["NAME", "ROLE", "MINISTRY", "STATUS"], records: [["Profile to be added", "Leadership role", "Church", "Draft"]] },
  media: { title: "Media library", description: "Prepare images and media for church content.", columns: ["FILE", "TYPE", "ADDED", "STATUS"], records: [["No media uploaded", "—", "—", "Empty"]] },
  inquiries: { title: "Inquiries", description: "Review contact and visitor messages when connected to the API.", columns: ["SENDER", "SUBJECT", "RECEIVED", "STATUS"], records: [["No inquiries yet", "—", "—", "Empty"]] },
  "prayer-requests": { title: "Prayer requests", description: "Review requests shared with the church prayer team.", columns: ["REQUEST", "RECEIVED", "FOLLOW-UP", "STATUS"], records: [["No requests yet", "—", "—", "Empty"]] },
  settings: { title: "Settings", description: "Church profile and website preferences.", columns: ["SETTING", "VALUE", "DESCRIPTION"], records: [["Church name", "Church", "Public name shown across the website"], ["Location", "Kigali, Rwanda", "Add approved street address"], ["Service schedule", "To be confirmed", "Add approved times and venue"]] },
};
