"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileText, X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

const ACCEPTED_TYPES = [
  "application/pdf",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "image/png",
  "image/jpeg",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function UploadCard() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Unsupported file type. Please upload a PDF, CSV, Excel, PNG, or JPEG file.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File is too large. Maximum size is 10 MB.";
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in to upload documents.");
        setIsUploading(false);
        return;
      }

      // Simulate document creation with processing status
      const { error: insertError } = await supabase.from("documents").insert({
        user_id: user.id,
        filename: selectedFile.name,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        status: "processing",
      });

      if (insertError) {
        setError("Failed to upload document. Please try again.");
        setIsUploading(false);
        return;
      }

      // Simulate processing delay then update to complete
      setTimeout(async () => {
        const { data: docs } = await supabase
          .from("documents")
          .select("id")
          .eq("user_id", user.id)
          .eq("filename", selectedFile.name)
          .order("created_at", { ascending: false })
          .limit(1);

        if (docs && docs[0]) {
          await supabase
            .from("documents")
            .update({
              status: "complete",
              total_fees: Math.round(Math.random() * 500 * 100) / 100,
              subscriptions_found: Math.floor(Math.random() * 8) + 1,
              unusual_activities: Math.floor(Math.random() * 4),
              savings_identified: Math.round(Math.random() * 300 * 100) / 100,
              insights: {
                fees: [
                  { name: "Monthly maintenance fee", amount: 12.99 },
                  { name: "ATM withdrawal fee", amount: 3.50 },
                  { name: "Wire transfer fee", amount: 25.00 },
                ],
                subscriptions: [
                  { name: "Netflix", amount: 15.99, frequency: "monthly" },
                  { name: "Spotify", amount: 9.99, frequency: "monthly" },
                  { name: "Amazon Prime", amount: 14.99, frequency: "monthly" },
                ],
                patterns: [
                  "Spending peaks on weekends",
                  "Dining expenses increased 23% from last period",
                  "Utility bills remain consistent",
                ],
                unusual: [
                  { description: "Large transfer to unknown account", amount: 2500, date: "2024-01-15" },
                ],
              },
            })
            .eq("id", docs[0].id);
        }
      }, 3000);

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsUploading(false);
    }
  };

  const handleTrySample = async () => {
    setIsUploading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("You must be signed in to try a sample document.");
        setIsUploading(false);
        return;
      }

      const { error: insertError } = await supabase.from("documents").insert({
        user_id: user.id,
        filename: "Sample_Bank_Statement_2024.pdf",
        file_type: "application/pdf",
        file_size: 245760,
        status: "complete",
        total_fees: 147.50,
        subscriptions_found: 6,
        unusual_activities: 2,
        savings_identified: 89.99,
        insights: {
          fees: [
            { name: "Monthly maintenance fee", amount: 14.99 },
            { name: "Overdraft protection fee", amount: 35.00 },
            { name: "International transaction fees", amount: 12.47 },
            { name: "Paper statement fee", amount: 5.00 },
          ],
          subscriptions: [
            { name: "Netflix Premium", amount: 22.99, frequency: "monthly" },
            { name: "Spotify Family", amount: 16.99, frequency: "monthly" },
            { name: "iCloud Storage", amount: 2.99, frequency: "monthly" },
            { name: "Gym Membership", amount: 49.99, frequency: "monthly" },
            { name: "Adobe Creative Cloud", amount: 54.99, frequency: "monthly" },
            { name: "Cloud Backup Service", amount: 9.99, frequency: "monthly" },
          ],
          patterns: [
            "Weekend dining spending is 3x weekday average",
            "Transportation costs increased 18% month-over-month",
            "Grocery spending is below average for your area",
            "You have 3 unused subscriptions with no recent activity",
          ],
          unusual: [
            {
              description: "Duplicate charge from online retailer",
              amount: 79.99,
              date: "2024-01-22",
            },
            {
              description: "Unrecognized international transaction",
              amount: 156.00,
              date: "2024-01-28",
            },
          ],
        },
      });

      if (insertError) {
        setError("Failed to create sample document. Please try again.");
        setIsUploading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !selectedFile && fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-150 cursor-pointer ${
          isDragging
            ? "border-[#10B981] bg-[#10B981]/5"
            : selectedFile
              ? "border-[#E5E7EB] bg-white cursor-default"
              : "border-[#E5E7EB] bg-white hover:border-[#10B981]/50 hover:bg-[#F9FAFB]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {!selectedFile ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 flex items-center justify-center mb-5">
              <Upload className="w-7 h-7 text-[#10B981]" />
            </div>
            <p className="font-heading text-lg font-semibold text-[#1F2937] mb-2">
              Drop your document here
            </p>
            <p className="text-sm text-[#6B7280] mb-4">
              or click to browse · PDF, CSV, Excel, PNG, JPEG · Max 10 MB
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#10B981]" />
              </div>
              <div className="text-left">
                <p className="font-medium text-[#1F2937] text-sm">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-[#6B7280]">
                  {formatSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                setError(null);
              }}
              className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-[#EF4444] bg-[#EF4444]/5 rounded-xl p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl h-11 text-sm font-medium disabled:opacity-40"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Analyze Document
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleTrySample}
          disabled={isUploading}
          className="flex-1 border-[#E5E7EB] text-[#1F2937] rounded-xl h-11 text-sm font-medium hover:bg-[#F9FAFB]"
        >
          <FileText className="w-4 h-4 mr-2 text-[#6B7280]" />
          Try a Sample Document
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-[#6B7280]">
        🔒 Your documents are encrypted and processed securely. We never store
        raw files.
      </p>
    </div>
  );
}
