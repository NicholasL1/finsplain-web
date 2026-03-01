import React from "react";
import { render, screen, waitFor, act } from "../test-utils";
import HowItWorksDemo from "@/src/components/HowItWorksDemo";

// Per-test IntersectionObserver mock that exposes the callback so we can
// simulate the element entering / leaving the viewport.
let ioCallback: ((entries: IntersectionObserverEntry[]) => void) | undefined;

function triggerIntersection(isIntersecting: boolean) {
  ioCallback?.([{ isIntersecting } as IntersectionObserverEntry]);
}

beforeEach(() => {
  jest.useFakeTimers();
  ioCallback = undefined;
  (global.IntersectionObserver as jest.Mock) = jest.fn().mockImplementation((cb) => {
    ioCallback = cb;
    return { observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn() };
  });
});

afterEach(() => {
  jest.useRealTimers();
});

describe("HowItWorksDemo", () => {
  it("renders the faux browser bar initially", () => {
    render(<HowItWorksDemo />);
    expect(screen.getByText("finsplain.net/upload")).toBeInTheDocument();
  });

  it("shows the idle drop zone before intersection fires", () => {
    render(<HowItWorksDemo />);
    expect(screen.getByText(/drop your file here/i)).toBeInTheDocument();
  });

  it("starts the drag animation when the element enters the viewport", async () => {
    const user = { advanceTimers: jest.advanceTimersByTime };
    void user;
    render(<HowItWorksDemo />);
    act(() => { triggerIntersection(true); });
    // Drag phase shows the drop zone text (same as idle, cursor appears async)
    expect(screen.getByText(/drop your file here/i)).toBeInTheDocument();
  });

  it("resets to idle when the element leaves the viewport", async () => {
    render(<HowItWorksDemo />);
    act(() => { triggerIntersection(true); });
    act(() => { triggerIntersection(false); });
    expect(screen.getByText(/drop your file here/i)).toBeInTheDocument();
  });

  it("does not start a second animation if already triggered", () => {
    render(<HowItWorksDemo />);
    act(() => { triggerIntersection(true); });
    act(() => { triggerIntersection(true); }); // second fire — should be ignored
    // Still in drag/idle phase, not jumped to processing
    expect(screen.queryByText(/analyzing Sample_Bank_Statement/i)).not.toBeInTheDocument();
  });

  it("transitions from drag to processing after timers elapse", async () => {
    render(<HowItWorksDemo />);
    act(() => { triggerIntersection(true); });
    act(() => { jest.advanceTimersByTime(3300); });
    await waitFor(() => {
      expect(screen.getByText(/analyzing Sample_Bank_Statement_2024\.pdf/i)).toBeInTheDocument();
    });
  });

  it("shows all three processing step labels after drag phase", async () => {
    render(<HowItWorksDemo />);
    act(() => { triggerIntersection(true); });
    act(() => { jest.advanceTimersByTime(3300); });
    await waitFor(() => {
      expect(screen.getByText(/Uploading document/)).toBeInTheDocument();
      expect(screen.getByText(/Extracting transactions/)).toBeInTheDocument();
      expect(screen.getByText(/Generating insights/)).toBeInTheDocument();
    });
  });

  it("transitions from processing to results after all timers elapse", async () => {
    render(<HowItWorksDemo />);
    act(() => { triggerIntersection(true); });
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      expect(screen.getByText(/sample data/i)).toBeInTheDocument();
    });
  });

  it("results phase shows the Monthly Spending Breakdown chart", async () => {
    render(<HowItWorksDemo />);
    act(() => { triggerIntersection(true); });
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      expect(screen.getByText("Monthly Spending Breakdown")).toBeInTheDocument();
    });
  });

  it("results phase shows the sample document filename", async () => {
    render(<HowItWorksDemo />);
    act(() => { triggerIntersection(true); });
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      expect(screen.getByText("Sample_Bank_Statement_2024.pdf")).toBeInTheDocument();
    });
  });

  it('results phase has a "Get Started Free" CTA linking to /sign-up', async () => {
    render(<HowItWorksDemo />);
    act(() => { triggerIntersection(true); });
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /get started free/i });
      expect(link).toHaveAttribute("href", "/sign-up");
    });
  });

  it('results phase has a "Watch again" button that replays the animation', async () => {
    render(<HowItWorksDemo />);
    act(() => { triggerIntersection(true); });
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      expect(screen.getByText(/watch again/i)).toBeInTheDocument();
    });
  });

  describe("compact mode", () => {
    it("shows the chart in compact results", async () => {
      render(<HowItWorksDemo compact />);
      act(() => { triggerIntersection(true); });
      act(() => { jest.advanceTimersByTime(3300); });
      act(() => { jest.advanceTimersByTime(4100); });
      await waitFor(() => {
        expect(screen.getByText("Monthly Spending Breakdown")).toBeInTheDocument();
      });
    });

    it("does NOT show detailed section headings in compact results", async () => {
      render(<HowItWorksDemo compact />);
      act(() => { triggerIntersection(true); });
      act(() => { jest.advanceTimersByTime(3300); });
      act(() => { jest.advanceTimersByTime(4100); });
      await waitFor(() => {
        // Chart is visible, detailed sections are hidden
        expect(screen.getByText("Monthly Spending Breakdown")).toBeInTheDocument();
        expect(screen.queryByText("Fees Identified")).not.toBeInTheDocument();
        expect(screen.queryByText("Active Subscriptions")).not.toBeInTheDocument();
        expect(screen.queryByText("Spending Patterns")).not.toBeInTheDocument();
        expect(screen.queryByText("Unusual Activity")).not.toBeInTheDocument();
      });
    });
  });
});
