import React from "react";
import { render, screen } from "../test-utils";
import { FormMessage } from "@/src/components/FormMessage";

describe("FormMessage", () => {
  it("renders a success message", () => {
    render(<FormMessage message={{ success: "Account created!" }} />);
    expect(screen.getByText("Account created!")).toBeInTheDocument();
  });

  it("renders an error message", () => {
    render(<FormMessage message={{ error: "Invalid credentials." }} />);
    expect(screen.getByText("Invalid credentials.")).toBeInTheDocument();
  });

  it("renders a generic message", () => {
    render(<FormMessage message={{ message: "Check your email." }} />);
    expect(screen.getByText("Check your email.")).toBeInTheDocument();
  });

  it("does not render error styles when given a success message", () => {
    render(<FormMessage message={{ success: "Done!" }} />);
    // Success message present, no red-500 error element
    expect(screen.getByText("Done!")).toBeInTheDocument();
    expect(screen.getByText("Done!").className).toMatch(/green/);
  });
});
