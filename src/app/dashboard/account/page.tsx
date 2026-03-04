import Navbar from "@/src/components/Navbar";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import AccountSettings from "@/src/components/AccountSettings";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/12 via-transparent to-indigo-500/8 dark:from-emerald-500/6 dark:to-indigo-500/4 pointer-events-none" aria-hidden="true" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-3xl pointer-events-none" aria-hidden="true" />
      <Navbar />
      <AccountSettings
        userEmail={user.email || ""}
        userFullName={user.user_metadata?.full_name ?? user.user_metadata?.name ?? ""}
      />
    </div>
  );
}
