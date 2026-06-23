"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CaseError({
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
    <div className="border border-red-200 bg-red-50 px-4 py-6" role="alert">
      <h2 className="text-sm font-semibold text-red-900">Case review unavailable</h2>
      <p className="mt-1 text-sm text-red-800">{error.message}</p>
      <Button className="mt-3" variant="secondary" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
