"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Scale, Tag, Package, User } from "lucide-react";

interface ListingCardProps {
  id: string;
  wasteType: string;
  weightKg: number;
  pricePerKg: number;
  status: string;
  imageUrl?: string;
  sellerName?: string;
  location?: string;
  purpose?: string;
  cardType: "HOUSEHOLD" | "COLLECTOR" | "INDUSTRY";
  onActionClick: (id: string) => void;
}

export default function ListingCard({
  id,
  wasteType,
  weightKg,
  pricePerKg,
  status,
  imageUrl,
  sellerName,
  location,
  purpose,
  cardType,
  onActionClick,
}: ListingCardProps) {
  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  const getThemeByCardType = () => {
    if (cardType === "HOUSEHOLD") {
      return {
        badgeBg: "bg-emerald-100",
        badgeText: "text-emerald-800",
        btnColor: "bg-emerald-600 hover:bg-emerald-700",
        actionText: "Detail / Klaim Jemputan",
        borderColor: "border-emerald-200",
      };
    }
    if (cardType === "COLLECTOR") {
      return {
        badgeBg: "bg-blue-100",
        badgeText: "text-blue-800",
        btnColor: "bg-blue-900 hover:bg-blue-800",
        actionText: "Buka Negosiasi B2B",
        borderColor: "border-blue-200",
      };
    }
    // Industry 
    return {
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-800",
      btnColor: "bg-amber-500 hover:bg-amber-600",
      actionText: "Penuhi Permintaan",
      borderColor: "border-amber-200",
    };
  };

  const theme = getThemeByCardType();
  const displayLabel = wasteType.replace(/_/g, " ");

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow border ${theme.borderColor} flex flex-col h-full bg-white`}>
      <div className="relative h-48 w-full bg-slate-100 border-b border-slate-200 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={displayLabel} className="w-full h-full object-cover" />
        ) : (
          <Package className="h-12 w-12 text-slate-300" />
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Badge className={`font-semibold px-2.5 py-0.5 ${theme.badgeBg} ${theme.badgeText} border-none shadow-sm`}>
            {status}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3 pt-4">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-bold text-slate-900 line-clamp-2 leading-tight">
            {purpose || displayLabel}
          </CardTitle>
        </div>
        {purpose && (
          <Badge variant="outline" className="mt-2 text-slate-600 w-fit">
            Kategori Dasar: {displayLabel}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pb-4 space-y-2.5 flex-1">
        <div className="flex items-center text-sm text-slate-700">
          <Scale className="h-4 w-4 mr-2 text-slate-500 shrink-0" />
          <span className="font-semibold">{weightKg} kg</span>
        </div>
        
        <div className="flex items-center text-sm text-slate-700">
          <Tag className="h-4 w-4 mr-2 text-slate-500 shrink-0" />
          <span className="font-semibold text-emerald-700">{formatRupiah(pricePerKg)} / kg</span>
        </div>

        {sellerName && (
          <div className="flex items-center text-sm text-slate-600 mt-4 pt-4 border-t border-slate-100">
            <User className="h-4 w-4 mr-2 text-slate-400 shrink-0" />
            <span className="truncate">{sellerName}</span>
          </div>
        )}

        {location && (
          <div className="flex items-center text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 mr-2 text-slate-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4 px-4 mt-auto">
        <Button 
          onClick={() => onActionClick(id)}
          className={`w-full text-white font-semibold ${theme.btnColor} shadow-sm`}
        >
          {theme.actionText}
        </Button>
      </CardFooter>
    </Card>
  );
}
