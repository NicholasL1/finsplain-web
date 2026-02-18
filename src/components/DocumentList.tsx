"use client";

import { FileText, ArrowRight, Upload } from "lucide-react";
import StatusBadge from "@/src/components/StatusBadge";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

interface Document {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  status: "processing" | "complete" | "error";
  total_fees: number | null;
  subscriptions_found: number | null;
  unusual_activities: number | null;
  savings_identified: number | null;
  created_at: string;
}

interface DocumentListProps {
  documents: Document[];
}

export default function DocumentList({ documents }: DocumentListProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 flex items-center justify-center mb-6">
          <FileText className="w-7 h-7 text-[#10B981]" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-[#1F2937] mb-2">
          No documents yet
        </h3>
        <p className="text-[#6B7280] text-sm mb-6 text-center max-w-sm">
          Upload your first financial document to get started with clear,
          actionable insights.
        </p>
        <Link href="/dashboard/upload">
          <Button className="bg-[#10B981] hover:bg-[#059669] text-white rounded-xl px-6 h-11 text-sm font-medium">
            <Upload className="w-4 h-4 mr-2" />
            Upload Your First Document
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <Link
          key={doc.id}
          href={`/dashboard/documents/${doc.id}`}
          className="group flex items-center justify-between p-5 rounded-2xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-150"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#6B7280]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <p className="font-medium text-[#1F2937] text-sm">
                  {doc.filename}
                </p>
                <StatusBadge status={doc.status} />
              </div>
              <p className="text-xs text-[#6B7280] mt-1">
                {formatDate(doc.created_at)} · {formatSize(doc.file_size)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {doc.status === "complete" && (
              <div className="hidden sm:flex items-center gap-4 text-xs">
                {doc.total_fees != null && (
                  <span className="bg-[#F59E0B]/10 text-[#D97706] px-2 py-0.5 rounded-md font-medium">
                    ${doc.total_fees.toFixed(2)} fees
                  </span>
                )}
                {doc.subscriptions_found != null &&
                  doc.subscriptions_found > 0 && (
                    <span className="bg-[#10B981]/10 text-[#059669] px-2 py-0.5 rounded-md font-medium">
                      {doc.subscriptions_found} subscriptions
                    </span>
                  )}
                {doc.unusual_activities != null &&
                  doc.unusual_activities > 0 && (
                    <span className="bg-[#EF4444]/10 text-[#EF4444] px-2 py-0.5 rounded-md font-medium">
                      {doc.unusual_activities} unusual
                    </span>
                  )}
              </div>
            )}
            <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#10B981] transition-colors" />
          </div>
        </Link>
      ))}
    </div>
  );
}
