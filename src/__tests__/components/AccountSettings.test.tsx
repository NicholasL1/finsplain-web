import React from "react";
import { render, screen, waitFor, createMockSupabaseClient } from "../test-utils";
import userEvent from "@testing-library/user-event";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import AccountSettings from "@/src/components/AccountSettings";

// Mock Supabase browser client
const mockSupabase = createMockSupabaseClient();
jest.mock("@/supabase/client", () => ({
  createClient: jest.fn(),
}));

// Mock the server action for theme persistence
jest.mock("@/src/app/actions", () => ({
  updateThemeAction: jest.fn().mockResolvedValue(undefined),
}));

import { createClient } from "@/supabase/client";
import { updateThemeAction } from "@/src/app/actions";

const mockUseTheme = useTheme as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

beforeEach(() => {
  (createClient as jest.Mock).mockReturnValue(mockSupabase);
  mockSupabase.auth.getUser.mockResolvedValue({
    data: { user: { id: "u1" } },
    error: null,
  });
  mockUseTheme.mockReturnValue({ theme: "light", setTheme: jest.fn() });
  mockUseRouter.mockReturnValue({ push: jest.fn(), refresh: jest.fn() });
});

describe("AccountSettings", () => {
  it("renders the user email in the Profile section", () => {
    render(<AccountSettings userEmail="jane@example.com" />);
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("renders the Full Name input field", () => {
    render(<AccountSettings userEmail="jane@example.com" />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it("disables the Save Changes button when the name input is empty", () => {
    render(<AccountSettings userEmail="jane@example.com" />);
    expect(screen.getByRole("button", { name: /save changes/i })).toBeDisabled();
  });

  it("enables the Save Changes button when a name is typed", async () => {
    const user = userEvent.setup();
    render(<AccountSettings userEmail="jane@example.com" />);
    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    expect(screen.getByRole("button", { name: /save changes/i })).not.toBeDisabled();
  });

  it("calls supabase.auth.updateUser when Save Changes is clicked", async () => {
    const user = userEvent.setup();
    render(<AccountSettings userEmail="jane@example.com" />);
    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.click(screen.getByRole("button", { name: /save changes/i }));
    await waitFor(() => {
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        data: { full_name: "Jane Doe" },
      });
    });
  });

  it('shows "✓ Saved" feedback after a successful profile save', async () => {
    const user = userEvent.setup();
    render(<AccountSettings userEmail="jane@example.com" />);
    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.click(screen.getByRole("button", { name: /save changes/i }));
    await waitFor(() => {
      expect(screen.getByText(/✓ saved/i)).toBeInTheDocument();
    });
  });

  it("renders Light, Dark, and System theme buttons in the Appearance section", () => {
    render(<AccountSettings userEmail="jane@example.com" />);
    expect(screen.getByRole("button", { name: /^light$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^dark$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^system$/i })).toBeInTheDocument();
  });

  it("calls setTheme and updateThemeAction when a theme button is clicked", async () => {
    const setTheme = jest.fn();
    mockUseTheme.mockReturnValue({ theme: "light", setTheme });
    const user = userEvent.setup();
    render(<AccountSettings userEmail="jane@example.com" />);
    await user.click(screen.getByRole("button", { name: /^dark$/i }));
    expect(setTheme).toHaveBeenCalledWith("dark");
    await waitFor(() => {
      expect(updateThemeAction).toHaveBeenCalledWith("dark");
    });
  });

  it("calls supabase.auth.signOut and redirects to / when Sign Out is clicked", async () => {
    const mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush, refresh: jest.fn() });
    const user = userEvent.setup();
    render(<AccountSettings userEmail="jane@example.com" />);
    await user.click(screen.getByRole("button", { name: /sign out/i }));
    await waitFor(() => {
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
