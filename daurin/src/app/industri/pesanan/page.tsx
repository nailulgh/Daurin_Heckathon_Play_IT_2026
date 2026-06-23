import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageSearch, Calendar, Factory, FileText, ExternalLink } from "lucide-react";
import { formatRupiah } from "@/lib/co2";

// Server Component
export default async function IndustriPesananPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== "INDUSTRI") {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: {
      buyerId: userId,
    },
    include: {
      material: {
        include: {
          collector: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "MENUNGGU":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-transparent">Menunggu</Badge>;
      case "NEGOSIASI":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-transparent">Negosiasi</Badge>;
      case "DEAL":
        return <Badge className="bg-green-600 hover:bg-green-700 text-white border-transparent">Deal</Badge>;
      case "SELESAI":
        return <Badge className="bg-slate-700 hover:bg-slate-800 text-white border-transparent">Selesai</Badge>;
      case "DIBATALKAN":
        return <Badge variant="destructive" className="border-transparent">Dibatalkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <PackageSearch className="w-8 h-8 text-blue-900" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Pesanan Saya</h1>
            <p className="mt-1 text-slate-500">
              Pantau status pesanan bahan baku dan riwayat negosiasi Anda.
            </p>
          </div>
        </div>
        <Link 
          href="/industri/marketplace" 
          className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm text-center"
        >
          Cari Bahan Baku Baru
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
          <div className="bg-white p-4 rounded-full inline-block mb-4 shadow-sm">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Belum Ada Pesanan Aktif</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Anda belum membuat pesanan bahan baku apapun. Silakan kunjungi Marketplace B2B untuk mencari suplai yang sesuai dengan kebutuhan industri Anda.
          </p>
          <Link 
            href="/industri/marketplace" 
            className="inline-block mt-8 bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Menuju Marketplace B2B
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="flex flex-col border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/80">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-semibold tracking-wider">ORDER ID: {order.id.slice(-6).toUpperCase()}</p>
                    <CardTitle className="text-lg font-bold text-slate-800 line-clamp-1">
                      {order.material.purpose}
                    </CardTitle>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center text-xs text-slate-600 bg-white p-1.5 rounded-md border border-slate-100 w-max shadow-sm">
                  <Factory className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                  <span className="font-medium truncate max-w-[150px]">{order.material.collector.name}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-5 pb-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-slate-500 text-xs">Volume Dipesan</span>
                    <p className="font-bold text-slate-800">{order.volumeKg.toLocaleString('id-ID')} kg</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-500 text-xs">Harga Penawaran</span>
                    <p className="font-bold text-slate-800">{formatRupiah(order.material.pricePerKg)}<span className="text-xs font-normal text-slate-500">/kg</span></p>
                  </div>
                </div>
                
                {order.finalPrice ? (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
                    <span className="text-green-700 text-xs font-bold uppercase tracking-wider flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                      Harga Kesepakatan
                    </span>
                    <p className="font-extrabold text-green-900 text-xl mt-1">{formatRupiah(order.finalPrice)}<span className="text-sm font-medium text-green-700/80">/kg</span></p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-green-200/60">
                      <span className="text-xs text-green-800 font-medium">Total Nilai Transaksi</span>
                      <span className="text-sm font-bold text-green-900">{formatRupiah(order.finalPrice * order.volumeKg)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                    <span className="text-amber-700 text-xs font-bold uppercase tracking-wider">Estimasi Awal</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-amber-800 font-medium">Sebelum Negosiasi</span>
                      <span className="text-sm font-bold text-amber-900">{formatRupiah(order.material.pricePerKg * order.volumeKg)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 pb-4 px-6 border-t border-slate-100 mt-auto bg-white">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </div>
                  <Link 
                    href={`/industri/pesanan/${order.id}`}
                    className="flex items-center text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors group"
                  >
                    Buka Detail
                    <ExternalLink className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
