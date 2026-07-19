import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileTopbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  // Defense in depth: middleware already protects this route, but a
  // Server Component check ensures no protected data ever renders
  // without a valid session, even if middleware is bypassed/misconfigured.
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-void">
      <Sidebar userName={user.name} />
      <MobileTopbar />
      <div className="md:pl-64">
        <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
