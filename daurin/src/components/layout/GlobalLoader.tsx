"use client";

import { Loader2 } from "lucide-react";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-daurin-primary" />
        <p className="text-lg font-medium text-daurin-text animate-pulse">Memuat Daurin...</p>
      </div>
    </div>
  );
}
