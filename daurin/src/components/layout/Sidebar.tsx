"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Map, 
  Store, 
  PackageSearch,
  ShoppingCart,
  LayoutDashboard
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  // Bypass useSession for Pure Front-End Mock Mode
  // const { data: session } = useSession();

  let role = "RUMAH_TANGGA";
  if (pathname.startsWith("/pengepul")) role = "PENGEPUL";
  if (pathname.startsWith("/industri")) role = "INDUSTRI";

  const links = React.useMemo(() => {
    switch (role) {
      case "RUMAH_TANGGA":
        return [
          { href: "/rumah-tangga/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/rumah-tangga/listing", label: "Jual Sampah", icon: Store },
          { href: "/marketplace", label: "Marketplace", icon: ShoppingCart },
        ];
      case "PENGEPUL":
        return [
          { href: "/pengepul/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/pengepul/peta", label: "Peta Jemput", icon: Map },
          { href: "/pengepul/bahan-baku/new", label: "Bahan Baku", icon: PackageSearch },
          { href: "/marketplace", label: "Marketplace", icon: ShoppingCart },
        ];
      case "INDUSTRI":
        return [
          { href: "/industri/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/industri/pesanan", label: "Pesanan Saya", icon: PackageSearch },
          { href: "/marketplace", label: "Marketplace", icon: ShoppingCart },
        ];
      default:
        return [
          { href: "/", label: "Home", icon: Home },
        ];
    }
  }, [role]);
  
  // if (!session) return null; // Disabled for mock mode

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 transform border-r bg-white transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;
              
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)} // Close sidebar on mobile after click
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-gray-100",
                      isActive 
                        ? "bg-green-50 text-daurin-primary" 
                        : "text-gray-700 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-daurin-primary" : "text-gray-400")} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}
