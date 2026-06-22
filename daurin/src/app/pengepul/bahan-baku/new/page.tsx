"use client";

import React from "react";
import { PackageSearch } from "lucide-react";
import MaterialListingForm from "@/components/listing/MaterialListingForm";

export default function PengepulBahanBakuNewPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-200">
        <div className="bg-blue-100 p-3 rounded-xl">
          <PackageSearch className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Input Bahan Baku</h1>
          <p className="mt-1 text-slate-500">
            Jual hasil pilahan sampah Anda ke industri pengolah.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
        <MaterialListingForm />
      </div>
    </div>
  );
}
