import React from "react";
import { render, screen } from "../test-utils";
import userEvent from "@testing-library/user-event";
import { ResetPasswordForm } from "@/src/components/ResetPasswordForm";

jest.mock("@/src/app/actions", () => ({
  resetPasswordAction: jest.fn(),
}));

describe("ResetPasswordForm", () => {
  it("renders the New password and Confirm password fields", () => {
    render(<ResetPasswordForm />);
    expect(document.querySelector("input[name='password']")).toBeInTheDocument();
    expect(document.querySelector("input[name='confirmPassword']")).toBeInTheDocument();
  });

  it("renders a Reset password submit button", () => {
    render(<ResetPasswordForm />);
    expect(
      screen.getByRole("button", { name: /reset password/i })
    ).toBeInTheDocument();
  });

  it("submit button is disabled when fields are empty", () => {
    render(<ResetPasswordForm />);
    expect(screen.getByRole("button", { name: /reset password/i })).toBeDisabled();
  });

  it("shows the strength checker after typing in the password field", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);
    const passwordInput = document.querySelector("input[name='password']") as HTMLInputElement;
    await user.type(passwordInput, "a");
    expect(screen.getByText(/at least 12 characters/i)).toBeInTheDocument();
  });

  it("shows a mismatch warning when confirm password does not match", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);
    const passwordInput = document.querySelector("input[name='password']") as HTMLInputElement;
    const confirmInput = document.querySelector("input[name='confirmPassword']") as HTMLInputElement;
    await user.type(passwordInput, "StrongPass1!");
    await user.type(confirmInput, "DifferentPass1!");
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("shows a match message when confirm password matches", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);
    const passwordInput = document.querySelector("input[name='password']") as HTMLInputElement;
    const confirmInput = document.querySelector("input[name='confirmPassword']") as HTMLInputElement;
    await user.type(passwordInput, "StrongPass1!");
    await user.type(confirmInput, "StrongPass1!");
    expect(screen.getByText(/passwords match/i)).toBeInTheDocument();
  });

  it("submit button is disabled when passwords do not match", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);
    const passwordInput = document.querySelector("input[name='password']") as HTMLInputElement;
    const confirmInput = document.querySelector("input[name='confirmPassword']") as HTMLInputElement;
    await user.type(passwordInput, "StrongPass1!");
    await user.type(confirmInput, "WrongPass1!");
    expect(screen.getByRole("button", { name: /reset password/i })).toBeDisabled();
  });

  it("enables the submit button when a valid password is confirmed correctly", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);
    const passwordInput = document.querySelector("input[name='password']") as HTMLInputElement;
    const confirmInput = document.querySelector("input[name='confirmPassword']") as HTMLInputElement;
    await user.type(passwordInput, "StrongPass1!");
    await user.type(confirmInput, "StrongPass1!");
    expect(screen.getByRole("button", { name: /reset password/i })).not.toBeDisabled();
  });

  it("renders an optional FormMessage when message prop is provided", () => {
    render(<ResetPasswordForm message={{ error: "Token expired." }} />);
    expect(screen.getByText("Token expired.")).toBeInTheDocument();
  });
});
