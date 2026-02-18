"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { UserCircle, LogOut, Save, Loader2 } from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

interface AccountSettingsProps {
  userEmail: string;
}

export default function AccountSettings({ userEmail }: AccountSettingsProps) {
  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      await supabase
        .from("users")
        .update({ full_name: fullName, name: fullName })
        .eq("id", user.id);

      setSaved(true);
    }

    setIsSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <main className="container mx-auto px-4 py-8 sm:py-12 max-w-2xl">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F2937] mb-8">
        Account Settings
      </h1>

      {/* Profile Section */}
      <div className="rounded-2xl border border-[#E5E7EB] p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#10B981]/10 flex items-center justify-center">
            <UserCircle className="w-7 h-7 text-[#10B981]" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold text-[#1F2937]">
              Profile
            </h2>
            <p className="text-sm text-[#6B7280]">{userEmail}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-[#1F2937] mb-1.5 block"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="border-[#E5E7EB] focus:border-[#10B981] focus:ring-[#10B981] rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving || !fullName}
              className="bg-[#10B981] hover:bg-[#059669] text-white rounded-xl px-5 h-10 text-sm font-medium disabled:opacity-40"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            {saved && (
              <span className="text-sm text-[#10B981] font-medium">
                ✓ Saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Session */}
      <div className="rounded-2xl border border-[#E5E7EB] p-6">
        <h2 className="font-heading text-lg font-semibold text-[#1F2937] mb-2">
          Session
        </h2>
        <p className="text-sm text-[#6B7280] mb-4">
          Sign out of your account on this device.
        </p>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/5 hover:text-[#EF4444] rounded-xl h-10 text-sm font-medium"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </main>
  );
}
