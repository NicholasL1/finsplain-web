import React from "react";
import { render, screen } from "../test-utils";
import DocumentList from "@/src/components/DocumentList";
import { createMockDocument } from "../test-utils";

describe("DocumentList", () => {
  describe("empty state", () => {
    it("shows the empty state heading when there are no documents", () => {
      render(<DocumentList documents={[]} />);
      expect(screen.getByText("No documents yet")).toBeInTheDocument();
    });

    it("shows an upload CTA button linking to /dashboard/upload", () => {
      render(<DocumentList documents={[]} />);
      const link = screen.getByRole("link", {
        name: /upload your first document/i,
      });
      expect(link).toHaveAttribute("href", "/dashboard/upload");
    });
  });

  describe("with documents", () => {
    it("renders a row for each document", () => {
      const docs = [
        createMockDocument({ id: "a", filename: "statement-jan.pdf" }),
        createMockDocument({ id: "b", filename: "statement-feb.pdf" }),
      ];
      render(<DocumentList documents={docs} />);
      expect(screen.getByText("statement-jan.pdf")).toBeInTheDocument();
      expect(screen.getByText("statement-feb.pdf")).toBeInTheDocument();
    });

    it("links each document to its detail page", () => {
      const doc = createMockDocument({ id: "doc-99" });
      render(<DocumentList documents={[doc]} />);
      const link = screen.getByRole("link", { name: /bank-statement\.pdf/i });
      expect(link).toHaveAttribute("href", "/dashboard/documents/doc-99");
    });

    it("shows a StatusBadge for each document", () => {
      render(<DocumentList documents={[createMockDocument()]} />);
      expect(screen.getByText("Complete")).toBeInTheDocument();
    });

    it("shows the fees badge for a complete document with total_fees", () => {
      const doc = createMockDocument({ status: "complete", total_fees: 45.5 });
      render(<DocumentList documents={[doc]} />);
      expect(screen.getByText(/\$45\.50 fees/i)).toBeInTheDocument();
    });

    it("shows the subscriptions badge when subscriptions_found > 0", () => {
      const doc = createMockDocument({ status: "complete", subscriptions_found: 3 });
      render(<DocumentList documents={[doc]} />);
      expect(screen.getByText(/3 subscriptions/i)).toBeInTheDocument();
    });

    it("shows the unusual badge when unusual_activities > 0", () => {
      const doc = createMockDocument({ status: "complete", unusual_activities: 2 });
      render(<DocumentList documents={[doc]} />);
      expect(screen.getByText(/2 unusual/i)).toBeInTheDocument();
    });

    it("does not show stats badges for a processing document", () => {
      const doc = createMockDocument({ status: "processing", total_fees: null });
      render(<DocumentList documents={[doc]} />);
      expect(screen.queryByText(/fees/i)).not.toBeInTheDocument();
    });

    it("formats file size in KB correctly", () => {
      const doc = createMockDocument({ file_size: 2048 }); // 2 KB
      render(<DocumentList documents={[doc]} />);
      expect(screen.getByText(/2\.0 KB/i)).toBeInTheDocument();
    });
  });
});
