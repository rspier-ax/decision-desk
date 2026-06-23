"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="border border-red-200 bg-red-50 px-4 py-6" role="alert">
      <h2 className="text-sm font-semibold text-red-900">Something went wrong</h2>
      <p className="mt-1 text-sm text-red-800">
        An unexpected error occurred while loading this page.
      </p>
      <Button className="mt-3" variant="secondary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
