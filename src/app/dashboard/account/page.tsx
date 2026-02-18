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
    <div className="min-h-screen bg-white">
      <Navbar />
      <AccountSettings userEmail={user.email || ""} />
    </div>
  );
}
