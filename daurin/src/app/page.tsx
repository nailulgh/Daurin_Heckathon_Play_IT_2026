import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Verified, Factory, Truck, Home as HomeIcon, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary selection:text-on-primary font-sans">
      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center pt-8 pb-16 px-4 md:px-8 overflow-hidden">
          <div className="absolute top-0 right-0 -z-10 w-2/3 h-full opacity-10" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
            <div className="z-10">
              <span className="inline-block py-1 px-3 rounded-full bg-emerald-wash text-primary font-medium text-sm mb-6">
                Circular Economy Leader
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-on-surface mb-6 leading-tight">
                Ubah Sampah Jadi Berkah, <br />
                <span className="text-primary">Satukan Rantai Daur Ulang.</span>
              </h1>
              <p className="text-lg text-on-surface-variant mb-8 max-w-lg">
                Platform marketplace sirkular yang menghubungkan rumah tangga, pengumpul, dan industri untuk memaksimalkan dampak lingkungan dan ekonomi.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/login" className="bg-primary hover:bg-primary-container text-white hover:text-on-primary-container px-8 py-4 rounded-lg font-medium shadow-lg transition-all active:scale-95 flex items-center gap-2">
                  Mulai Menjual
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/marketplace" className="bg-surface-container-highest hover:bg-outline-variant text-on-surface px-8 py-4 rounded-lg font-medium transition-all flex items-center gap-2">
                  Marketplace
                  <ShoppingCart className="w-5 h-5" />
                </Link>
              </div>
            </div>
            
            <div className="relative flex justify-center items-center mt-12 md:mt-0">
              <div className="relative w-full aspect-square max-w-md">
                <div className="absolute inset-0 bg-primary rounded-3xl rotate-3 opacity-5"></div>
                <div className="absolute inset-0 bg-secondary-container rounded-3xl -rotate-3 opacity-5"></div>
                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img className="w-full h-full object-cover" alt="Recycling facility" src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop" />
                </div>
                
                {/* Floating Micro-card */}
                <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-xl shadow-xl border border-outline-variant animate-float z-20">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500 p-2 rounded-full text-white">
                      <Verified className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-on-surface">AI Verified</p>
                      <p className="text-xs text-on-surface-variant">PET Plastic Grade A</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Ticker Section */}
        <section className="bg-primary text-primary-container py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-primary-container/30">
              <div className="text-center md:text-left px-4">
                <p className="text-4xl font-black text-white">45,230<span className="text-secondary-fixed text-2xl">kg</span></p>
                <p className="text-sm uppercase tracking-wider opacity-80 text-white mt-2">Waste Recycled</p>
              </div>
              <div className="text-center px-4">
                <p className="text-4xl font-black text-white">85,120<span className="text-secondary-fixed text-2xl">kg</span></p>
                <p className="text-sm uppercase tracking-wider opacity-80 text-white mt-2">CO2 Offset</p>
              </div>
              <div className="text-center md:text-right px-4">
                <p className="text-4xl font-black text-white">1,200+</p>
                <p className="text-sm uppercase tracking-wider opacity-80 text-white mt-2">Active Contributors</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Section */}
        <section className="py-24 px-4 md:px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-on-surface">Ekosistem Marketplace Sirkular</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">Menghubungkan setiap mata rantai daur ulang untuk menciptakan nilai ekonomi dari limbah yang sebelumnya terbuang.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface p-8 rounded-xl shadow-sm border border-outline-variant hover:border-primary transition-colors group">
                <div className="bg-emerald-wash w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <HomeIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Rumah Tangga</h3>
                <p className="text-sm text-on-surface-variant mb-6">Mulai memilah sampah dari sumbernya, kumpulkan poin, dan jual langsung ke pengepul terverifikasi di sekitar Anda.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm font-medium text-on-surface">
                    <CheckCircle className="text-primary w-4 h-4" /> AI Waste Detection
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-on-surface">
                    <CheckCircle className="text-primary w-4 h-4" /> Pickup Request
                  </li>
                </ul>
              </div>
              
              <div className="bg-surface p-8 rounded-xl shadow-sm border border-outline-variant hover:border-primary transition-colors group">
                <div className="bg-secondary-fixed w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-on-secondary-container group-hover:scale-110 transition-transform">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Pengepul & Hub</h3>
                <p className="text-sm text-on-surface-variant mb-6">Optimalkan rute armada, kelola inventori material, dan lakukan negosiasi bulk-order dengan industri besar.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm font-medium text-on-surface">
                    <CheckCircle className="text-secondary w-4 h-4" /> Route Optimization
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-on-surface">
                    <CheckCircle className="text-secondary w-4 h-4" /> B2B Marketplace Access
                  </li>
                </ul>
              </div>

              <div className="bg-surface p-8 rounded-xl shadow-sm border border-outline-variant hover:border-primary transition-colors group">
                <div className="bg-primary-container/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <Factory className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Industri Pengolah</h3>
                <p className="text-sm text-on-surface-variant mb-6">Dapatkan pasokan bahan baku daur ulang berkualitas secara konsisten dengan transparansi data penuh.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm font-medium text-on-surface">
                    <CheckCircle className="text-primary w-4 h-4" /> Traceability Report
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-on-surface">
                    <CheckCircle className="text-primary w-4 h-4" /> ESG Data Insights
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Porting */}
        <footer className="bg-surface-container-highest pt-16 pb-8 px-4 md:px-8 border-t border-outline-variant">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <span className="text-3xl font-black text-primary mb-6 block">Daurin.</span>
                <p className="text-on-surface-variant max-w-sm mb-8">
                  Memberdayakan ekonomi sirkular Indonesia melalui teknologi marketplace yang transparan, efisien, dan berdampak.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-6">Platform</h4>
                <ul className="space-y-4 text-on-surface-variant text-sm font-medium">
                  <li><Link className="hover:text-primary" href="/marketplace">Marketplace</Link></li>
                  <li><Link className="hover:text-primary" href="/dashboard">Impact Dashboard</Link></li>
                  <li><Link className="hover:text-primary" href="/login">Logistics Support</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-6">About</h4>
                <ul className="space-y-4 text-on-surface-variant text-sm font-medium">
                  <li><a className="hover:text-primary" href="#">Our Mission</a></li>
                  <li><a className="hover:text-primary" href="#">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-outline-variant pt-8 flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-xs text-outline">© 2026 Daurin Marketplace. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
