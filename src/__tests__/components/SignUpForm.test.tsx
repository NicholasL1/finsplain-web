import React from "react";
import { render, screen } from "../test-utils";
import userEvent from "@testing-library/user-event";
import { SignUpForm } from "@/src/components/SignUpForm";

jest.mock("@/src/app/actions", () => ({
  signUpAction: jest.fn(),
}));

describe("SignUpForm", () => {
  it("renders Full Name, Email, and Password fields", () => {
    render(<SignUpForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(document.querySelector("input[name='password']")).toBeInTheDocument();
  });

  it("renders a Sign up submit button", () => {
    render(<SignUpForm />);
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it('renders a "Sign in" link to /sign-in', () => {
    render(<SignUpForm />);
    const link = screen.getByRole("link", { name: /sign in/i });
    expect(link).toHaveAttribute("href", "/sign-in");
  });

  it("hides the password strength checker before the user types", () => {
    render(<SignUpForm />);
    expect(screen.queryByText(/at least 12 characters/i)).not.toBeInTheDocument();
  });

  it("shows the strength checker after the user starts typing a password", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    const passwordInput = document.querySelector("input[name='password']") as HTMLInputElement;
    await user.type(passwordInput, "a");
    expect(screen.getByText(/at least 12 characters/i)).toBeInTheDocument();
  });

  it("marks the length check as met when password is >= 12 characters", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    const passwordInput = document.querySelector("input[name='password']") as HTMLInputElement;
    await user.type(passwordInput, "abcdefghijkl"); // 12 chars
    const lengthItem = screen.getByText(/at least 12 characters/i);
    // When met, the label gets an emerald class
    expect(lengthItem.className).toMatch(/emerald/);
  });

  it("marks the uppercase check as met when an uppercase letter is present", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    const passwordInput = document.querySelector("input[name='password']") as HTMLInputElement;
    await user.type(passwordInput, "A");
    expect(
      screen.getByText(/one uppercase letter/i).className
    ).toMatch(/emerald/);
  });

  it("marks the number check as met when a digit is present", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    const passwordInput = document.querySelector("input[name='password']") as HTMLInputElement;
    await user.type(passwordInput, "1");
    expect(screen.getByText(/one number/i).className).toMatch(/emerald/);
  });

  it("marks the symbol check as met when a special character is present", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    const passwordInput = document.querySelector("input[name='password']") as HTMLInputElement;
    await user.type(passwordInput, "!");
    expect(screen.getByText(/one special character/i).className).toMatch(/emerald/);
  });

  it("disables the submit button when the password does not meet all requirements", () => {
    render(<SignUpForm />);
    expect(screen.getByRole("button", { name: /sign up/i })).toBeDisabled();
  });

  it("enables the submit button when all password requirements are met", async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    const passwordInput = document.querySelector("input[name='password']") as HTMLInputElement;
    // A password that meets all 5 requirements
    await user.type(passwordInput, "StrongPass1!");
    expect(screen.getByRole("button", { name: /sign up/i })).not.toBeDisabled();
  });
});
