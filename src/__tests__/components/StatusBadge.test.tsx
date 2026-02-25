import React from "react";
import { render, screen } from "../test-utils";
import StatusBadge from "@/src/components/StatusBadge";

describe("StatusBadge", () => {
  it('renders "Processing" label for processing status', () => {
    render(<StatusBadge status="processing" />);
    expect(screen.getByText("Processing")).toBeInTheDocument();
  });

  it('renders "Complete" label for complete status', () => {
    render(<StatusBadge status="complete" />);
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it('renders "Error" label for error status', () => {
    render(<StatusBadge status="error" />);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders a pulse indicator dot for processing status", () => {
    const { container } = render(<StatusBadge status="processing" />);
    const dot = container.querySelector(".animate-pulse");
    expect(dot).toBeInTheDocument();
  });

  it("does not render a pulse dot for complete status", () => {
    const { container } = render(<StatusBadge status="complete" />);
    expect(container.querySelector(".animate-pulse")).not.toBeInTheDocument();
  });

  it("accepts and applies an optional className", () => {
    const { container } = render(
      <StatusBadge status="complete" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
