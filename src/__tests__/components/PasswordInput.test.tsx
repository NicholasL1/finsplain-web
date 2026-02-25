import React from "react";
import { render, screen } from "../test-utils";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "@/src/components/PasswordInput";

describe("PasswordInput", () => {
  it("renders as a password input by default", () => {
    render(<PasswordInput />);
    // type=password inputs have no ARIA textbox role — query the DOM directly
    const input = document.querySelector("input");
    expect(input).toHaveAttribute("type", "password");
  });

  it("has a toggle button with 'Show password' label initially", () => {
    render(<PasswordInput />);
    expect(
      screen.getByRole("button", { name: /show password/i })
    ).toBeInTheDocument();
  });

  it("reveals the password when the toggle is clicked", async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    const toggle = screen.getByRole("button", { name: /show password/i });
    await user.click(toggle);
    const input = document.querySelector("input");
    expect(input).toHaveAttribute("type", "text");
  });

  it("hides the password again on a second toggle click", async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    const toggle = screen.getByRole("button", { name: /show password/i });
    await user.click(toggle);
    await user.click(screen.getByRole("button", { name: /hide password/i }));
    const input = document.querySelector("input");
    expect(input).toHaveAttribute("type", "password");
  });

  it("updates the aria-label to 'Hide password' after revealing", async () => {
    const user = userEvent.setup();
    render(<PasswordInput />);
    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(
      screen.getByRole("button", { name: /hide password/i })
    ).toBeInTheDocument();
  });
});
