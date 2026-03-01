import React from "react";
import { render, screen, waitFor, act } from "../test-utils";
import userEvent from "@testing-library/user-event";
import SampleDocumentModal from "@/src/components/SampleDocumentModal";

// Recharts uses ResizeObserver internally — already mocked globally in jest.setup.ts

describe("SampleDocumentModal", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the "Try a Sample Document" trigger button', () => {
    render(<SampleDocumentModal />);
    expect(
      screen.getByRole("button", { name: /try a sample document/i })
    ).toBeInTheDocument();
  });

  it("dialog is closed initially", () => {
    render(<SampleDocumentModal />);
    expect(screen.queryByText(/drop your file here/i)).not.toBeInTheDocument();
  });

  it("opens the dialog and shows the drag phase on trigger click", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SampleDocumentModal />);
    await user.click(
      screen.getByRole("button", { name: /try a sample document/i })
    );
    expect(screen.getByText(/drop your file here/i)).toBeInTheDocument();
    expect(screen.getByText(/drag and drop your file to begin/i)).toBeInTheDocument();
  });

  it("transitions from drag to processing phase after the drag animation", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SampleDocumentModal />);
    await user.click(
      screen.getByRole("button", { name: /try a sample document/i })
    );
    act(() => { jest.advanceTimersByTime(3200); });
    await waitFor(() => {
      expect(screen.getByText(/analyzing Sample_Bank_Statement_2024\.pdf/i)).toBeInTheDocument();
    });
  });

  it("shows all three processing step labels after drag phase completes", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SampleDocumentModal />);
    await user.click(
      screen.getByRole("button", { name: /try a sample document/i })
    );
    act(() => { jest.advanceTimersByTime(3200); });
    await waitFor(() => {
      expect(screen.getByText(/Uploading document/)).toBeInTheDocument();
      expect(screen.getByText(/Extracting transactions/)).toBeInTheDocument();
      expect(screen.getByText(/Generating insights/)).toBeInTheDocument();
    });
  });

  it("transitions from processing to results phase after all timers elapse", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SampleDocumentModal />);
    await user.click(
      screen.getByRole("button", { name: /try a sample document/i })
    );
    // Two separate advances: drag phase first, then processing phase.
    // React must flush the drag→processing state change between the two advances
    // so the processing useEffect can register its own timers.
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      expect(screen.getByText(/sample data/i)).toBeInTheDocument();
    });
  });

  it("results phase shows the sample document filename", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SampleDocumentModal />);
    await user.click(
      screen.getByRole("button", { name: /try a sample document/i })
    );
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      expect(
        screen.getByText("Sample_Bank_Statement_2024.pdf")
      ).toBeInTheDocument();
    });
  });

  it("results phase shows the Monthly Spending Breakdown chart", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SampleDocumentModal />);
    await user.click(
      screen.getByRole("button", { name: /try a sample document/i })
    );
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      expect(screen.getByText("Monthly Spending Breakdown")).toBeInTheDocument();
    });
  });

  it("results phase shows the Fees Identified section", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SampleDocumentModal />);
    await user.click(
      screen.getByRole("button", { name: /try a sample document/i })
    );
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      expect(screen.getByText("Fees Identified")).toBeInTheDocument();
    });
  });

  it("results phase shows the Active Subscriptions section", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SampleDocumentModal />);
    await user.click(
      screen.getByRole("button", { name: /try a sample document/i })
    );
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      expect(screen.getByText("Active Subscriptions")).toBeInTheDocument();
    });
  });

  it("results phase shows the Spending Patterns section", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SampleDocumentModal />);
    await user.click(
      screen.getByRole("button", { name: /try a sample document/i })
    );
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      expect(screen.getByText("Spending Patterns")).toBeInTheDocument();
    });
  });

  it("results phase shows the Unusual Activity section", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SampleDocumentModal />);
    await user.click(
      screen.getByRole("button", { name: /try a sample document/i })
    );
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      expect(screen.getByText("Unusual Activity")).toBeInTheDocument();
    });
  });

  it('results phase has a "Get Started Free" CTA linking to /sign-up', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<SampleDocumentModal />);
    await user.click(
      screen.getByRole("button", { name: /try a sample document/i })
    );
    act(() => { jest.advanceTimersByTime(3300); });
    act(() => { jest.advanceTimersByTime(4100); });
    await waitFor(() => {
      const link = screen.getByRole("link", { name: /get started free/i });
      expect(link).toHaveAttribute("href", "/sign-up");
    });
  });

  it("resets to drag phase when the dialog is reopened", async () => {
    // Real timers needed so userEvent keyboard events don't hang
    jest.useRealTimers();
    const user = userEvent.setup();
    render(<SampleDocumentModal />);

    // First open: immediately in drag phase
    await user.click(screen.getByRole("button", { name: /try a sample document/i }));
    expect(screen.getByText(/drop your file here/i)).toBeInTheDocument();

    // Close via Escape
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByText(/drop your file here/i)).not.toBeInTheDocument();
    });

    // Re-open: should reset back to drag phase
    await user.click(screen.getByRole("button", { name: /try a sample document/i }));
    expect(screen.getByText(/drop your file here/i)).toBeInTheDocument();
    expect(screen.queryByText("Fees Identified")).not.toBeInTheDocument();
  });
});
