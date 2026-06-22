"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const session = localStorage.getItem("mock_session");
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("mock_session");
    window.location.href = "/login";
  };

  const getDisplayRole = (role: string) => {
    switch (role) {
      case "RUMAH_TANGGA": return "Warga";
      case "PENGEPUL": return "Mitra Pengepul";
      case "INDUSTRI": return "Mitra Industri";
      default: return role;
    }
  };

  const renderUserSection = () => {
    if (!mounted) {
      return <div className="h-10 w-32 bg-slate-100 animate-pulse rounded-md hidden md:block"></div>;
    }

    if (user) {
      return (
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium leading-none text-daurin-text">
              {user.name}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              {getDisplayRole(user.role)} <span className="opacity-70">({user.role})</span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="hidden sm:flex border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="sm:hidden text-gray-500 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      );
    }

    return (
      <Link href="/login">
        <Button className="bg-daurin-primary hover:bg-emerald-700 text-white">
          <User className="mr-2 h-4 w-4" />
          Login
        </Button>
      </Link>
    );
  };

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

          {renderUserSection()}
        </div>
      </div>
    </nav>
  );
}
