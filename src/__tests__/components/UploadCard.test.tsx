import React from "react";
import { render, screen, waitFor, fireEvent, createMockSupabaseClient } from "../test-utils";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import UploadCard from "@/src/components/UploadCard";

const mockSupabase = createMockSupabaseClient();

jest.mock("@/supabase/client", () => ({
  createClient: jest.fn(),
}));

import { createClient } from "@/supabase/client";

const mockUseRouter = useRouter as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  (createClient as jest.Mock).mockReturnValue(mockSupabase);
  mockUseRouter.mockReturnValue({ push: jest.fn(), refresh: jest.fn() });
  mockSupabase.auth.getUser.mockResolvedValue({
    data: { user: { id: "u1" } },
    error: null,
  });
});

describe("UploadCard — idle state", () => {
  it('renders the "Upload a financial document" heading', () => {
    render(<UploadCard />);
    expect(
      screen.getByText(/upload a financial document/i)
    ).toBeInTheDocument();
  });

  it('renders a "Select a file" button', () => {
    render(<UploadCard />);
    expect(screen.getByRole("button", { name: /select a file/i })).toBeInTheDocument();
  });

  it('renders a "Try a sample document" button', () => {
    render(<UploadCard />);
    expect(
      screen.getByRole("button", { name: /try a sample document/i })
    ).toBeInTheDocument();
  });

  it("renders all three security badges", () => {
    render(<UploadCard />);
    expect(screen.getByText(/files are processed securely/i)).toBeInTheDocument();
    expect(screen.getByText(/documents can be deleted/i)).toBeInTheDocument();
    expect(screen.getByText(/we don't sell your data/i)).toBeInTheDocument();
  });

  it("the hidden file input accepts the correct MIME types via the accept attribute", () => {
    render(<UploadCard />);
    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
    expect(fileInput).toHaveAttribute(
      "accept",
      ".pdf,.png,.jpg,.jpeg,.heic,.heif"
    );
  });
});

describe("UploadCard — file validation", () => {
  it("shows an error for an unsupported file type", async () => {
    render(<UploadCard />);
    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
    const badFile = new File(["content"], "doc.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [badFile] } });
    await waitFor(() => {
      expect(screen.getByText(/unsupported file type/i)).toBeInTheDocument();
    });
  });

  it("shows an error when the file exceeds 10 MB", async () => {
    render(<UploadCard />);
    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
    // Create a mock file that reports itself as 11 MB
    const bigFile = new File(["x"], "big.pdf", { type: "application/pdf" });
    Object.defineProperty(bigFile, "size", { value: 11 * 1024 * 1024 });
    fireEvent.change(fileInput, { target: { files: [bigFile] } });
    await waitFor(() => {
      expect(screen.getByText(/file is too large/i)).toBeInTheDocument();
    });
  });
});

describe("UploadCard — unauthenticated redirect", () => {
  it("redirects to /sign-in when an unauthenticated user selects a file", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    const mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush, refresh: jest.fn() });
    const user = userEvent.setup();
    render(<UploadCard />);
    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File(["pdf"], "statement.pdf", { type: "application/pdf" });
    await user.upload(fileInput, file);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/sign-in");
    });
  });

  it("redirects to /sign-in when an unauthenticated user clicks Try a sample document", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    const mockPush = jest.fn();
    mockUseRouter.mockReturnValue({ push: mockPush, refresh: jest.fn() });
    const user = userEvent.setup();
    render(<UploadCard />);
    await user.click(screen.getByRole("button", { name: /try a sample document/i }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/sign-in");
    });
  });
});

describe("UploadCard — processing phase", () => {
  it('shows "Analyzing your document" heading once a valid file is selected', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UploadCard />);
    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File(["pdf"], "statement.pdf", { type: "application/pdf" });
    await user.upload(fileInput, file);
    await waitFor(() => {
      expect(screen.getByText(/analyzing your document/i)).toBeInTheDocument();
    });
    jest.useRealTimers();
  });

  it("shows the three analysis step labels during processing", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<UploadCard />);
    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File(["pdf"], "statement.pdf", { type: "application/pdf" });
    await user.upload(fileInput, file);
    await waitFor(() => {
      expect(screen.getByText("Upload complete")).toBeInTheDocument();
      expect(screen.getByText("Extracting transactions")).toBeInTheDocument();
      expect(screen.getByText("Generating insights")).toBeInTheDocument();
    });
    jest.useRealTimers();
  });
});
