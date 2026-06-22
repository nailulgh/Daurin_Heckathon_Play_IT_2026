"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatRupiah } from "@/lib/co2";
import { format } from "date-fns";

interface NegotiationEvent {
  id: string;
  type: string;
  amount: number | null;
  message: string | null;
  createdAt: string;
  actor: {
    id: string;
    name: string;
    role: string;
  };
}

interface Order {
  id: string;
  status: string;
  buyerId: string;
  material: {
    collectorId: string;
  };
}

interface NegotiationThreadProps {
  order: Order;
  negotiations: NegotiationEvent[];
  currentUserId: string;
}

export default function NegotiationThread({ order, negotiations, currentUserId }: NegotiationThreadProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (type: string) => {
    if ((type === "OFFER" || type === "COUNTER_OFFER") && !amount) {
      toast({ title: "Masukkan nominal penawaran", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/negotiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: amount ? parseFloat(amount) : undefined,
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengirim negosiasi");
      }

      toast({ title: "Berhasil", description: "Status negosiasi diperbarui!" });
      window.location.reload(); // Hard refresh to get new server-rendered state for hackathon speed
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "MENUNGGU": return "bg-gray-500";
      case "NEGOSIASI": return "bg-blue-500";
      case "DEAL": return "bg-green-600";
      case "DIBATALKAN": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const isBuyer = currentUserId === order.buyerId;
  const isSeller = currentUserId === order.material.collectorId;
  const lastEvent = negotiations[negotiations.length - 1];
  const isMyTurn = lastEvent?.actor.id !== currentUserId;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
        <h2 className="text-lg font-bold">Status Pesanan</h2>
        <Badge className={`${getStatusColor(order.status)} text-white`}>
          {order.status}
        </Badge>
      </div>

      <div className="space-y-4 flex-1">
        {negotiations.map((neg) => {
          const isMe = neg.actor.id === currentUserId;
          return (
            <div key={neg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <div className="text-xs text-gray-500 mb-1 px-1">
                {neg.actor.name} ({neg.actor.role}) • {format(new Date(neg.createdAt), "dd MMM HH:mm")}
              </div>
              <Card className={`max-w-[80%] ${isMe ? "bg-green-50 border-green-200" : "bg-white"}`}>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={neg.type === "DEAL" ? "default" : neg.type === "CANCEL" ? "destructive" : "secondary"}>
                      {neg.type.replace("_", " ")}
                    </Badge>
                    {neg.amount && <span className="font-bold text-amber-600">{formatRupiah(neg.amount)}/kg</span>}
                  </div>
                  {neg.message && <p className="text-sm text-gray-700">{neg.message}</p>}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Action Panel */}
      {order.status === "NEGOSIASI" && isMyTurn && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h3 className="font-semibold text-sm">Giliran Anda Merespon</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              type="number" 
              placeholder="Harga Counter (Rp/kg)" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input 
              type="text" 
              placeholder="Pesan..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleAction("COUNTER_OFFER")} disabled={isSubmitting} variant="outline" className="flex-1">
              Counter Offer
            </Button>
            <Button onClick={() => handleAction("DEAL")} disabled={isSubmitting} className="flex-1 bg-green-600 hover:bg-green-700">
              Terima (DEAL)
            </Button>
            <Button onClick={() => handleAction("CANCEL")} disabled={isSubmitting} variant="destructive" className="flex-1">
              Tolak / Batalkan
            </Button>
          </div>
        </div>
      )}

      {order.status === "MENUNGGU" && isBuyer && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <h3 className="font-semibold text-sm">Mulai Negosiasi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              type="number" 
              placeholder="Penawaran Awal (Rp/kg)" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input 
              type="text" 
              placeholder="Pesan..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button onClick={() => handleAction("OFFER")} disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
            Kirim Penawaran
          </Button>
        </div>
      )}
    </div>
  );
}
