"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCO2 } from "@/lib/co2";
import { Leaf, TreeDeciduous } from "lucide-react";

interface CO2ImpactWidgetProps {
  totalCO2SavedKg: number;
}

export default function CO2ImpactWidget({ totalCO2SavedKg }: CO2ImpactWidgetProps) {
  // Common estimate: A mature tree absorbs ~22kg of CO2 per year.
  const equivalentTrees = Math.floor(totalCO2SavedKg / 22);

  return (
    <Card className="bg-emerald-600 text-white border-none shadow-md overflow-hidden relative">
      <div className="absolute -right-6 -top-6 opacity-10">
        <Leaf className="w-32 h-32" />
      </div>
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-sm font-bold text-emerald-100 flex items-center">
          <Leaf className="w-4 h-4 mr-2" />
          Dampak Lingkungan (Reduksi Emisi)
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-4xl font-extrabold tracking-tight">
          {formatCO2(totalCO2SavedKg)}
        </div>
        <div className="mt-4 flex items-center bg-emerald-700/50 rounded-lg p-3 w-fit">
          <TreeDeciduous className="w-5 h-5 text-emerald-200 mr-2 shrink-0" />
          <p className="text-sm text-emerald-50">
            Setara dengan emisi yang diserap oleh <span className="font-bold text-white">{equivalentTrees.toLocaleString("id-ID")} pohon</span> dalam setahun.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
