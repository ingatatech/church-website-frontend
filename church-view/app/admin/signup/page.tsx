import type { Metadata } from "next";
import { AdminAuthPage } from "../../../src/views/admin/admin-auth-page";

export const metadata: Metadata = {
  title: "Create an admin account",
  robots: { index: false, follow: false },
};

export default function AdminSignupPage() {
  return <AdminAuthPage
    step="register"
    title="Create your account"
    description="Enter your details to begin account setup."
  />;
}
