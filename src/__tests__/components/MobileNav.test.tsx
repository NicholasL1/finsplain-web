import React from "react";
import { render, screen } from "../test-utils";
import userEvent from "@testing-library/user-event";
import MobileNav from "@/src/components/MobileNav";

describe("MobileNav", () => {
  it("renders the hamburger menu button", () => {
    render(<MobileNav isAuthenticated={false} />);
    expect(
      screen.getByRole("button", { name: /toggle menu/i })
    ).toBeInTheDocument();
  });

  it("opens the menu when the hamburger button is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileNav isAuthenticated={false} />);
    expect(screen.queryByText("How It Works")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.getByText("How It Works")).toBeInTheDocument();
  });

  it("closes the menu when the X button is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileNav isAuthenticated={false} />);
    await user.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.getByText("How It Works")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /toggle menu/i }));
    expect(screen.queryByText("How It Works")).not.toBeInTheDocument();
  });

  describe("unauthenticated links", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<MobileNav isAuthenticated={false} />);
      await user.click(screen.getByRole("button", { name: /toggle menu/i }));
    });

    it('shows "How It Works" link pointing to /how-it-works', () => {
      const link = screen.getByRole("link", { name: /how it works/i });
      expect(link).toHaveAttribute("href", "/how-it-works");
    });

    it('shows "Privacy" link pointing to /privacy', () => {
      const link = screen.getByRole("link", { name: /privacy/i });
      expect(link).toHaveAttribute("href", "/privacy");
    });

    it('shows "Sign In" link pointing to /sign-in', () => {
      const link = screen.getByRole("link", { name: /sign in/i });
      expect(link).toHaveAttribute("href", "/sign-in");
    });

    it('shows "Get Started" button linking to /sign-up', () => {
      const link = screen.getByRole("link", { name: /get started/i });
      expect(link).toHaveAttribute("href", "/sign-up");
    });

    it("does not show authenticated links", () => {
      expect(screen.queryByText("Documents")).not.toBeInTheDocument();
      expect(screen.queryByText("Upload")).not.toBeInTheDocument();
    });
  });

  describe("authenticated links", () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<MobileNav isAuthenticated={true} />);
      await user.click(screen.getByRole("button", { name: /toggle menu/i }));
    });

    it('shows "Upload" link pointing to /dashboard/upload', () => {
      const link = screen.getByRole("link", { name: /upload/i });
      expect(link).toHaveAttribute("href", "/dashboard/upload");
    });

    it('shows "Documents" link pointing to /dashboard', () => {
      const link = screen.getByRole("link", { name: /documents/i });
      expect(link).toHaveAttribute("href", "/dashboard");
    });

    it('shows "Account" link pointing to /dashboard/account', () => {
      const link = screen.getByRole("link", { name: /account/i });
      expect(link).toHaveAttribute("href", "/dashboard/account");
    });

    it("does not show unauthenticated links", () => {
      expect(screen.queryByText("How It Works")).not.toBeInTheDocument();
      expect(screen.queryByText("Get Started")).not.toBeInTheDocument();
    });
  });

  it("closes the menu when a link is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileNav isAuthenticated={false} />);
    await user.click(screen.getByRole("button", { name: /toggle menu/i }));
    await user.click(screen.getByRole("link", { name: /how it works/i }));
    expect(screen.queryByText("How It Works")).not.toBeInTheDocument();
  });
});
