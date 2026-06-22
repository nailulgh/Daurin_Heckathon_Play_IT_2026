"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle2, XCircle } from "lucide-react";

interface NegotiationActionControlsProps {
  currentStatus: "NEGOSIASI" | "DEAL" | "DIBATALKAN";
  isMyTurn: boolean;
  onSendOffer: (amount: number, message: string) => void;
  onAcceptDeal: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  lastOfferAmount?: number;
}

export default function NegotiationActionControls({
  currentStatus,
  isMyTurn,
  onSendOffer,
  onAcceptDeal,
  onCancel,
  isSubmitting,
  lastOfferAmount
}: NegotiationActionControlsProps) {
  const [offerAmount, setOfferAmount] = useState<number | "">("");
  const [message, setMessage] = useState("");

  if (currentStatus === "DEAL" || currentStatus === "DIBATALKAN") {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center mt-4">
        <p className="text-slate-600 font-medium">
          Negosiasi telah {currentStatus === "DEAL" ? "mencapai kesepakatan" : "dibatalkan"}.
          Tidak ada tindakan lebih lanjut yang dapat dilakukan.
        </p>
      </div>
    );
  }

  if (!isMyTurn) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center mt-4">
        <div className="animate-pulse flex items-center justify-center space-x-2 text-amber-600">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <div className="w-2 h-2 rounded-full bg-amber-500 delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-amber-500 delay-150"></div>
        </div>
        <p className="text-slate-600 font-medium mt-3">
          Menunggu balasan dari pihak lain...
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerAmount && Number(offerAmount) > 0) {
      onSendOffer(Number(offerAmount), message);
      setOfferAmount("");
      setMessage("");
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 mt-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 border-b border-slate-100 pb-4">
        <Button 
          onClick={onAcceptDeal}
          disabled={isSubmitting || !lastOfferAmount}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Sepakat (Deal)
        </Button>
        <Button 
          onClick={onCancel}
          disabled={isSubmitting}
          variant="outline"
          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Batalkan
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="space-y-2">
          <Label htmlFor="offerAmount" className="text-slate-800 font-semibold">Ajukan Penawaran Baru (Rp/kg)</Label>
          <Input
            id="offerAmount"
            type="number"
            min="100"
            required
            placeholder="Contoh: 8500"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value === "" ? "" : Number(e.target.value))}
            className="border-slate-300 focus-visible:ring-blue-600"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message" className="text-slate-800 font-semibold">Pesan Pendukung (Opsional)</Label>
          <Textarea
            id="message"
            rows={2}
            placeholder="Misal: Saya ambil 2 ton jika harga bisa 8500..."
            value={message}
            onChange={(e: any) => setMessage(e.target.value)}
            className="border-slate-300 focus-visible:ring-blue-600 resize-none"
            disabled={isSubmitting}
          />
        </div>

        <Button 
          type="submit"
          disabled={isSubmitting || !offerAmount}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold"
        >
          <Send className="w-4 h-4 mr-2" />
          Kirim Penawaran
        </Button>
      </form>
    </div>
  );
}
