"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface DataPoint {
  month: string;
  Plastik: number;
  Kertas: number;
  Logam: number;
}

interface VolumeTrendChartProps {
  data: DataPoint[];
}

export default function VolumeTrendChart({ data }: VolumeTrendChartProps) {
  return (
    <Card className="border-slate-200 shadow-sm w-full h-full min-h-[350px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-900">
          Tren Penyelamatan Sampah (Kg)
        </CardTitle>
        <p className="text-sm text-slate-500">Berdasarkan kategori utama per bulan.</p>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPlastik" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorKertas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLogam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#64748b" }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="Logam" 
                stackId="1" 
                stroke="#1e3a8a" 
                fill="url(#colorLogam)" 
              />
              <Area 
                type="monotone" 
                dataKey="Kertas" 
                stackId="1" 
                stroke="#f59e0b" 
                fill="url(#colorKertas)" 
              />
              <Area 
                type="monotone" 
                dataKey="Plastik" 
                stackId="1" 
                stroke="#059669" 
                fill="url(#colorPlastik)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
