"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { LogOut, Save, Loader2, Sun, Moon, Monitor } from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { updateThemeAction } from "@/src/app/actions";
import { cn } from "@/src/lib/utils";

interface AccountSettingsProps {
  userEmail: string;
  userFullName?: string;
}

type ThemeOption = { value: string; label: string; icon: React.ElementType };

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export default function AccountSettings({ userEmail, userFullName }: AccountSettingsProps) {
  const [fullName, setFullName] = useState(userFullName ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

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

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    setIsSavingTheme(true);
    await updateThemeAction(newTheme);
    setIsSavingTheme(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <main className="container mx-auto px-4 py-8 sm:py-12 max-w-2xl">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-8">
        Account Settings
      </h1>

      {/* Profile Section */}
      <div className="rounded-2xl border border-border border-t-2 border-t-emerald-500/40 p-6 mb-6">
        {/* Avatar + identity */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-3 select-none">
            {fullName ? (
              <span className="text-white font-bold text-2xl">
                {fullName.trim()[0].toUpperCase()}
              </span>
            ) : (
              <span className="text-white font-bold text-2xl">
                {userEmail[0].toUpperCase()}
              </span>
            )}
          </div>
          {fullName ? (
            <h2 className="font-heading text-xl font-bold text-foreground">
              {fullName}
            </h2>
          ) : (
            <h2 className="font-heading text-xl font-bold text-muted-foreground">
              No name set
            </h2>
          )}
          <p className="text-sm text-muted-foreground mt-0.5">{userEmail}</p>
        </div>

        <div className="border-t border-border pt-5 space-y-4">
          <div>
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-foreground mb-1.5 block"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="border-border focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving || !fullName}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 h-10 text-sm font-medium disabled:opacity-40"
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
              <span className="text-sm text-emerald-500 font-medium">
                ✓ Saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="rounded-2xl border border-border border-t-2 border-t-indigo-500/30 p-6 mb-6">
        <h2 className="font-heading text-lg font-semibold text-foreground mb-1">
          Appearance
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Choose how FinSplain looks for you. Saved to your account for all devices.
        </p>
        <div className="flex gap-3">
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleThemeChange(value)}
              className={cn(
                "flex flex-1 flex-col items-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
                theme === value
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-border text-muted-foreground hover:border-border/80 hover:bg-accent"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
        {isSavingTheme && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" />
            Saving preference…
          </p>
        )}
      </div>

      {/* Session */}
      <div className="rounded-2xl border border-border border-t-2 border-t-red-500/20 p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground mb-2">
          Session
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Sign out of your account on this device.
        </p>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="border-red-500/30 text-red-500 hover:bg-red-500/5 hover:text-red-500 rounded-xl h-10 text-sm font-medium"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </main>
  );
}
