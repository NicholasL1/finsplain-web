import React, { useActionState } from "react";
import { render, screen } from "../test-utils";
import { SignInForm } from "@/src/components/SignInForm";

// Server actions are not executed in JSDOM — mock the module
jest.mock("@/src/app/actions", () => ({
  signInActionWithState: jest.fn(),
}));

const mockUseActionState = useActionState as jest.Mock;

describe("SignInForm", () => {
  beforeEach(() => {
    // Reset to the default initial state before each test
    mockUseActionState.mockImplementation((_action: unknown, initial: unknown) => [
      initial,
      jest.fn(),
      false,
    ]);
  });

  it("renders an email input", () => {
    render(<SignInForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders a password input", () => {
    render(<SignInForm />);
    // PasswordInput renders an input that isn't labelled via accessible name from role
    expect(document.querySelector("input[name='password']")).toBeInTheDocument();
  });

  it("renders a Sign in submit button", () => {
    render(<SignInForm />);
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('renders a "Forgot Password?" link to /forgot-password', () => {
    render(<SignInForm />);
    const link = screen.getByRole("link", { name: /forgot password/i });
    expect(link).toHaveAttribute("href", "/forgot-password");
  });

  it('renders a "Sign up" link to /sign-up', () => {
    render(<SignInForm />);
    const link = screen.getByRole("link", { name: /sign up/i });
    expect(link).toHaveAttribute("href", "/sign-up");
  });

  it("does not show an error when state is null", () => {
    render(<SignInForm />);
    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
  });

  it("shows the error message when state has an error", () => {
    mockUseActionState.mockReturnValue([
      { error: "Invalid email or password.", attempts: 1 },
      jest.fn(),
      false,
    ]);
    render(<SignInForm />);
    expect(
      screen.getByText("Invalid email or password.")
    ).toBeInTheDocument();
  });

  it("hides the forgot-password hint when attempts < 5", () => {
    mockUseActionState.mockReturnValue([
      { error: "Wrong credentials.", attempts: 3 },
      jest.fn(),
      false,
    ]);
    render(<SignInForm />);
    expect(screen.queryByText(/reset your password/i)).not.toBeInTheDocument();
  });

  it("shows the forgot-password hint after 5 or more failed attempts", () => {
    mockUseActionState.mockReturnValue([
      { error: "Wrong credentials.", attempts: 5 },
      jest.fn(),
      false,
    ]);
    render(<SignInForm />);
    expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
  });
});
