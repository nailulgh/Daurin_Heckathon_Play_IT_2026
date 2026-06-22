"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterSchema } from "@/lib/validators";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type RegisterData = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    role: "RUMAH_TANGGA",
    wasteTypesHandled: [],
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as RegisterData["role"];
    setFormData((prev) => ({
      ...prev,
      role,
      // Reset waste types if not PENGEPUL
      wasteTypesHandled: role === "PENGEPUL" ? prev.wasteTypesHandled : [],
    }));
  };

  const handleWasteTypeToggle = (type: string) => {
    setFormData((prev) => {
      const isSelected = prev.wasteTypesHandled?.includes(type as any);
      const newTypes = isSelected
        ? prev.wasteTypesHandled?.filter((t) => t !== type)
        : [...(prev.wasteTypesHandled || []), type];
      return { ...prev, wasteTypesHandled: newTypes as any };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const parsed = RegisterSchema.safeParse(formData);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setServerError(errorData.error?.formErrors?.[0] || "Registration failed");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setServerError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const wasteTypeOptions = [
    "PLASTIK_PET",
    "PLASTIK_HDPE",
    "KERTAS_KARDUS",
    "LOGAM_KALENG",
    "KACA",
    "ELEKTRONIK",
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      <Link href="/" className="inline-flex items-center text-green-700 hover:text-green-900 mb-6 font-semibold transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Beranda
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6 p-8 md:p-10 bg-white rounded-2xl shadow-xl border border-green-50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-green-800 tracking-tight">Daftar Daurin</h2>
          <p className="text-gray-500 mt-2">Buat akun untuk memulai perjalanan daur ulang Anda</p>
        </div>

      {serverError && <div className="p-3 text-sm text-red-500 bg-red-50 rounded">{serverError}</div>}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
          placeholder="Nama Anda"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
          placeholder="email@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Peran (Role)</label>
        <select
          value={formData.role}
          onChange={handleRoleChange}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
        >
          <option value="RUMAH_TANGGA">Rumah Tangga</option>
          <option value="PENGEPUL">Pengepul</option>
          <option value="INDUSTRI">Industri</option>
        </select>
        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role[0]}</p>}
      </div>

      {formData.role === "PENGEPUL" && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Jenis Sampah yang Diterima</label>
          <div className="grid grid-cols-2 gap-2">
            {wasteTypeOptions.map((type) => (
              <label key={type} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.wasteTypesHandled?.includes(type as any) || false}
                  onChange={() => handleWasteTypeToggle(type)}
                  className="rounded text-green-600"
                />
                <span>{type.replace("_", " ")}</span>
              </label>
            ))}
          </div>
          {errors.wasteTypesHandled && (
            <p className="text-red-500 text-xs mt-1">{errors.wasteTypesHandled[0]}</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors mt-6 shadow-sm"
      >
        {isLoading ? "Mendaftar..." : "Daftar Sekarang"}
      </button>

      <div className="text-sm text-center mt-6 pt-6 border-t border-gray-100 text-gray-600">
        Sudah punya akun? <Link href="/login" className="text-green-700 font-semibold hover:underline">Masuk di sini</Link>
      </div>
    </form>
  </div>
  );
}
