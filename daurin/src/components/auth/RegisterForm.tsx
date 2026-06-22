"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegisterSchema } from "@/lib/validators";
import { z } from "zod";

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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 text-center mb-6">Daftar Daurin</h2>

      {serverError && <div className="p-3 text-sm text-red-500 bg-red-50 rounded">{serverError}</div>}

      <div>
        <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded p-2"
          placeholder="Nama Anda"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border rounded p-2"
          placeholder="email@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full border rounded p-2"
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Peran (Role)</label>
        <select
          value={formData.role}
          onChange={handleRoleChange}
          className="w-full border rounded p-2"
        >
          <option value="RUMAH_TANGGA">Rumah Tangga</option>
          <option value="PENGEPUL">Pengepul</option>
          <option value="INDUSTRI">Industri</option>
        </select>
        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role[0]}</p>}
      </div>

      {formData.role === "PENGEPUL" && (
        <div>
          <label className="block text-sm font-medium mb-2">Jenis Sampah yang Diterima</label>
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
        className="w-full bg-green-700 text-white font-semibold py-2 rounded hover:bg-green-800 disabled:opacity-50"
      >
        {isLoading ? "Mendaftar..." : "Daftar Sekarang"}
      </button>
    </form>
  );
}
