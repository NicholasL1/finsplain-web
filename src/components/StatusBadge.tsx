import { cn } from "@/src/lib/utils";

type StatusVariant = "processing" | "complete" | "error";

const variantStyles: Record<StatusVariant, string> = {
  processing: "bg-[#F59E0B]/10 text-[#D97706]",
  complete: "bg-[#10B981]/10 text-[#059669]",
  error: "bg-[#EF4444]/10 text-[#EF4444]",
};

const variantLabels: Record<StatusVariant, string> = {
  processing: "Processing",
  complete: "Complete",
  error: "Error",
};

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        variantStyles[status],
        className
      )}
    >
      {status === "processing" && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mr-1.5 animate-pulse" />
      )}
      {status === "complete" && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5" />
      )}
      {status === "error" && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mr-1.5" />
      )}
      {variantLabels[status]}
    </span>
  );
}
