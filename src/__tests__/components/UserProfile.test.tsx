import React from "react";
import { render, screen } from "../test-utils";
import userEvent from "@testing-library/user-event";
import UserProfile from "@/src/components/UserProfile";

// Mock the server action used by the sign out menu item
jest.mock("@/src/app/actions", () => ({
  signOutAction: jest.fn().mockResolvedValue(undefined),
}));

import { signOutAction } from "@/src/app/actions";

describe("UserProfile", () => {
  it("renders the user circle trigger button", () => {
    render(<UserProfile />);
    // The trigger button has no accessible text but is a button
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("opens the dropdown and shows navigation links when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<UserProfile />);
    await user.click(screen.getAllByRole("button")[0]);
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Upload")).toBeInTheDocument();
    expect(screen.getByText("Account Settings")).toBeInTheDocument();
  });

  it("has a Documents link pointing to /dashboard", async () => {
    const user = userEvent.setup();
    render(<UserProfile />);
    await user.click(screen.getAllByRole("button")[0]);
    // Radix DropdownMenuItem asChild renders <a> with role="menuitem", not "link"
    const item = screen.getByRole("menuitem", { name: /^documents$/i });
    expect(item).toHaveAttribute("href", "/dashboard");
  });

  it("has an Upload link pointing to /dashboard/upload", async () => {
    const user = userEvent.setup();
    render(<UserProfile />);
    await user.click(screen.getAllByRole("button")[0]);
    const item = screen.getByRole("menuitem", { name: /^upload$/i });
    expect(item).toHaveAttribute("href", "/dashboard/upload");
  });

  it("has an Account Settings link pointing to /dashboard/account", async () => {
    const user = userEvent.setup();
    render(<UserProfile />);
    await user.click(screen.getAllByRole("button")[0]);
    const item = screen.getByRole("menuitem", { name: /account settings/i });
    expect(item).toHaveAttribute("href", "/dashboard/account");
  });

  it("calls signOutAction when Sign out is clicked", async () => {
    const user = userEvent.setup();
    render(<UserProfile />);
    await user.click(screen.getAllByRole("button")[0]);
    await user.click(screen.getByText("Sign out"));
    expect(signOutAction).toHaveBeenCalled();
  });
});
