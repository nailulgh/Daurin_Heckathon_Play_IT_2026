"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw } from "lucide-react";

export type WasteType = 
  | "ALL"
  | "PLASTIK_PET" 
  | "PLASTIK_HDPE" 
  | "KERTAS_KARDUS" 
  | "LOGAM_KALENG" 
  | "KACA" 
  | "ELEKTRONIK";

export interface FilterState {
  wasteType: WasteType;
  maxPrice: number | "";
  maxDistanceKm: number | "";
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
}

const WASTE_TYPE_OPTIONS: { value: WasteType; label: string }[] = [
  { value: "ALL", label: "Semua Kategori" },
  { value: "PLASTIK_PET", label: "Plastik PET" },
  { value: "PLASTIK_HDPE", label: "Plastik HDPE" },
  { value: "KERTAS_KARDUS", label: "Kertas & Kardus" },
  { value: "LOGAM_KALENG", label: "Logam & Kaleng" },
  { value: "KACA", label: "Kaca" },
  { value: "ELEKTRONIK", label: "Elektronik" },
];

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const handleTypeChange = (value: WasteType) => {
    onChange({ ...filters, wasteType: value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({ ...filters, maxPrice: val === "" ? "" : Number(val) });
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange({ ...filters, maxDistanceKm: val === "" ? "" : Number(val) });
  };

  const resetFilters = () => {
    onChange({
      wasteType: "ALL",
      maxPrice: "",
      maxDistanceKm: "",
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm sticky top-24">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <h3 className="font-bold text-lg text-slate-900 flex items-center">
          <Filter className="w-5 h-5 mr-2 text-emerald-600" />
          Filter Data
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={resetFilters}
          className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 h-8 w-8"
          title="Reset Filter"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-800">Kategori Komoditas</Label>
          <div className="flex flex-col gap-2">
            {WASTE_TYPE_OPTIONS.map((opt) => (
              <label 
                key={opt.value} 
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="wasteType"
                  value={opt.value}
                  checked={filters.wasteType === opt.value}
                  onChange={() => handleTypeChange(opt.value)}
                  className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-600 cursor-pointer"
                />
                <span className={`text-sm transition-colors ${
                  filters.wasteType === opt.value ? 'text-emerald-700 font-medium' : 'text-slate-600 group-hover:text-slate-900'
                }`}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Max Price Filter */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <Label htmlFor="maxPrice" className="text-sm font-semibold text-slate-800">
            Harga Maksimal (Rp/kg)
          </Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="Contoh: 15000"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            className="border-slate-200 focus-visible:ring-emerald-600"
            min="0"
          />
        </div>

        {/* Distance Filter */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <Label htmlFor="maxDistance" className="text-sm font-semibold text-slate-800">
            Radius Maksimal (Km)
          </Label>
          <Input
            id="maxDistance"
            type="number"
            placeholder="Contoh: 10"
            value={filters.maxDistanceKm}
            onChange={handleDistanceChange}
            className="border-slate-200 focus-visible:ring-emerald-600"
            min="0"
          />
          <p className="text-xs text-slate-500">
            *Membutuhkan akses lokasi untuk menghitung jarak akurat.
          </p>
        </div>
      </div>
    </div>
  );
}
