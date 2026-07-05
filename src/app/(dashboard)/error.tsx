"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="bg-red-50 p-6 rounded-full border border-red-100">
        <AlertTriangle className="w-12 h-12 text-red-600" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Something went wrong</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          {error.message.includes("Unauthorized") 
            ? "You do not have permission to perform this action. Administrator access is required." 
            : "An unexpected error occurred. Please try again later."}
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Button onClick={() => reset()} className="bg-slate-900 hover:bg-slate-800 text-white">
          Try again
        </Button>
        <Link href="/dashboard">
          <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
