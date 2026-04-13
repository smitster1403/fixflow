import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar } from "./sidebar";
import { ensureLandlordExists } from "./actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Auto-create landlord record on first visit
  const user = await currentUser();
  if (user) {
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Landlord";
    const email = user.emailAddresses[0]?.emailAddress ?? "";
    await ensureLandlordExists(name, email);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
