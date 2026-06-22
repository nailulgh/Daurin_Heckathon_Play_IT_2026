"use client";

import React, { useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

export type NegotiationType = "OFFER" | "COUNTER_OFFER" | "DEAL" | "CANCEL";

export interface NegotiationLog {
  id: string;
  type: NegotiationType;
  actorRole: "INDUSTRI" | "PENGEPUL";
  actorName: string;
  amount: number;
  message?: string;
  createdAt: Date;
}

interface B2BNegotiationThreadProps {
  logs: NegotiationLog[];
}

export default function B2BNegotiationThread({ logs }: B2BNegotiationThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="flex flex-col space-y-4 p-4 h-[400px] overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl">
      {logs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <Clock className="w-10 h-10 mb-2 opacity-30" />
          <p>Belum ada riwayat negosiasi.</p>
        </div>
      ) : (
        logs.map((log) => {
          const isIndustry = log.actorRole === "INDUSTRI";
          const isSystemState = log.type === "DEAL" || log.type === "CANCEL";

          if (isSystemState) {
            return (
              <div key={log.id} className="flex justify-center my-4">
                <div className={`px-4 py-2 rounded-full border text-sm font-semibold flex items-center shadow-sm ${
                  log.type === "DEAL" 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  {log.type === "DEAL" ? (
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2 text-red-600" />
                  )}
                  {log.type === "DEAL" 
                    ? `DEAL: Rp${log.amount.toLocaleString("id-ID")}/kg disepakati` 
                    : "Negosiasi Dibatalkan"}
                </div>
              </div>
            );
          }

          return (
            <div 
              key={log.id} 
              className={`flex flex-col max-w-[80%] ${isIndustry ? "self-end items-end" : "self-start items-start"}`}
            >
              <div className="flex items-center space-x-2 mb-1 text-xs text-slate-500 px-1">
                <span className="font-semibold text-slate-700">{log.actorName}</span>
                <span>•</span>
                <span>{formatDistanceToNow(log.createdAt, { addSuffix: true, locale: idLocale })}</span>
              </div>
              
              <div className={`p-4 rounded-2xl shadow-sm border ${
                isIndustry 
                  ? "bg-blue-900 text-white border-blue-800 rounded-tr-sm" 
                  : "bg-white text-slate-800 border-slate-200 rounded-tl-sm"
              }`}>
                <div className="flex flex-col space-y-1">
                  <span className={`text-xs font-semibold tracking-wider ${isIndustry ? "text-blue-200" : "text-amber-600"}`}>
                    {log.type.replace("_", " ")}
                  </span>
                  <span className="text-xl font-bold">
                    {formatRupiah(log.amount)} / kg
                  </span>
                  {log.message && (
                    <p className={`text-sm mt-2 pt-2 border-t ${isIndustry ? "border-blue-800" : "border-slate-100"}`}>
                      {log.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
}
