"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  // Bypass useSession for Pure Front-End Mock Mode
  // const { data: session } = useSession();
  
  // Create a mock session based on the current path
  let mockSession = null;
  if (pathname.startsWith("/rumah-tangga") || pathname.startsWith("/pengepul") || pathname.startsWith("/industri") || pathname.startsWith("/dashboard")) {
    let mockRole = "RUMAH_TANGGA";
    let mockName = "Budi (Warga)";
    
    if (pathname.startsWith("/pengepul")) {
      mockRole = "PENGEPUL";
      mockName = "Pengepul Berkah";
    } else if (pathname.startsWith("/industri")) {
      mockRole = "INDUSTRI";
      mockName = "PT Daur Ulang";
    }

    mockSession = { user: { name: mockName, role: mockRole } };
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-daurin-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">D</span>
            </div>
            <span className="hidden sm:inline-block font-bold text-xl tracking-tight text-daurin-text">
              Daurin
            </span>
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-500 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-daurin-accent"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          {mockSession ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium leading-none text-daurin-text">
                  {mockSession.user?.name}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {(mockSession.user as any)?.role?.replace("_", " ")}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { window.location.href = "/login" }}
                className="hidden sm:flex border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => { window.location.href = "/login" }}
                className="sm:hidden text-gray-500 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-daurin-primary hover:bg-emerald-700 text-white">
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
