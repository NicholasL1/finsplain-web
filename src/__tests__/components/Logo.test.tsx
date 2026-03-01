import React from "react";
import { render, screen } from "../test-utils";
import Logo from "@/src/components/Logo";

describe("Logo", () => {
  it("renders an SVG element", () => {
    const { container } = render(<Logo />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has an accessible aria-label", () => {
    render(<Logo />);
    expect(screen.getByRole("img", { name: /finsplain logo/i })).toBeInTheDocument();
  });

  it("applies the default size of 32", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("applies a custom size prop", () => {
    const { container } = render(<Logo size={48} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "48");
    expect(svg).toHaveAttribute("height", "48");
  });

  it("applies a custom className", () => {
    const { container } = render(<Logo className="my-logo" />);
    expect(container.querySelector("svg")).toHaveClass("my-logo");
  });
});
