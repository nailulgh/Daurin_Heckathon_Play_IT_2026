"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import B2BNegotiationThread, { NegotiationLog } from "@/components/negotiation/B2BNegotiationThread";
import NegotiationActionControls from "@/components/negotiation/NegotiationActionControls";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Building2, PackageSearch } from "lucide-react";



export default function IndustryNegotiationPage() {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [logs, setLogs] = useState<NegotiationLog[]>([]);
  const [status, setStatus] = useState<"NEGOSIASI" | "DEAL" | "DIBATALKAN">("NEGOSIASI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  React.useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrderData(data);
          setStatus(data.status);
          
          if (data.negotiations && Array.isArray(data.negotiations)) {
            const fetchedLogs = data.negotiations.map((neg: any) => ({
              id: neg.id,
              type: neg.type,
              actorRole: neg.actor.role,
              actorName: neg.actor.name,
              amount: neg.amount,
              message: neg.message,
              createdAt: new Date(neg.createdAt)
            }));
            setLogs(fetchedLogs);
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  // In a real app, this would be computed based on whether the last log was from the other party.
  const isMyTurn = logs.length > 0 && logs[logs.length - 1].actorRole !== "INDUSTRI";
  const lastOfferAmount = logs.length > 0 ? logs[logs.length - 1].amount : undefined;

  const handleSendOffer = async (amount: number, message: string) => {
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/orders/${id}/negotiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "COUNTER_OFFER", amount, message }),
      });
      
      if (!res.ok) throw new Error("Gagal mengirim penawaran");
      
      const newLog = await res.json();
      
      setLogs((prev) => [...prev, {
        id: newLog.id,
        type: newLog.type,
        actorRole: "INDUSTRI",
        actorName: "Anda",
        amount: newLog.amount,
        message: newLog.message,
        createdAt: new Date(newLog.createdAt),
      }]);
      
      toast({
        title: "Penawaran Terkirim",
        description: `Penawaran sebesar Rp${amount.toLocaleString("id-ID")}/kg telah dikirim.`,
      });
    } catch (error) {
      toast({ title: "Gagal", description: "Terjadi kesalahan sistem.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptDeal = async () => {
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/orders/${id}/negotiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "DEAL", amount: lastOfferAmount }),
      });
      
      if (!res.ok) throw new Error("Gagal menyetujui penawaran");
      
      const newLog = await res.json();
      
      setLogs((prev) => [...prev, {
        id: newLog.id,
        type: newLog.type,
        actorRole: "INDUSTRI",
        actorName: "Sistem",
        amount: newLog.amount,
        createdAt: new Date(newLog.createdAt),
      }]);
      
      setStatus("DEAL");
      toast({
        title: "Kesepakatan Berhasil (DEAL)",
        description: "Transaksi telah disepakati.",
        className: "bg-emerald-50 border-emerald-200 text-emerald-900",
      });
    } catch (error) {
      toast({ title: "Gagal", description: "Terjadi kesalahan sistem.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    setIsSubmitting(true);
    
    try {
      const res = await fetch(`/api/orders/${id}/negotiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "CANCEL" }),
      });
      
      if (!res.ok) throw new Error("Gagal membatalkan");
      
      const newLog = await res.json();
      
      setLogs((prev) => [...prev, {
        id: newLog.id,
        type: newLog.type,
        actorRole: "INDUSTRI",
        actorName: "Sistem",
        amount: 0,
        createdAt: new Date(newLog.createdAt),
      }]);
      
      setStatus("DIBATALKAN");
      toast({
        title: "Negosiasi Dibatalkan",
        description: "Anda telah membatalkan negosiasi ini.",
        variant: "destructive",
      });
    } catch (error) {
      toast({ title: "Gagal", description: "Terjadi kesalahan sistem.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-200">
        <div className="bg-blue-100 p-3 rounded-xl">
          <Building2 className="w-8 h-8 text-blue-900" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Negosiasi B2B</h1>
            <Badge className={`px-3 py-1 font-bold ${
              status === "NEGOSIASI" ? "bg-amber-100 text-amber-800" :
              status === "DEAL" ? "bg-emerald-100 text-emerald-800" :
              "bg-red-100 text-red-800"
            }`}>
              {status}
            </Badge>
          </div>
          <p className="mt-1 text-slate-500 flex items-center">
            <PackageSearch className="w-4 h-4 mr-1.5" />
            ID Pesanan: #{id} {orderData?.material?.wasteType && `| ${orderData.material.wasteType} (${orderData.volumeKg}kg)`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 px-1">Riwayat Negosiasi</h2>
          <B2BNegotiationThread logs={logs} />
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-800 px-1 mb-4">Tindakan Anda</h2>
          <NegotiationActionControls 
            currentStatus={status}
            isMyTurn={isMyTurn}
            lastOfferAmount={lastOfferAmount}
            isSubmitting={isSubmitting}
            onSendOffer={handleSendOffer}
            onAcceptDeal={handleAcceptDeal}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
