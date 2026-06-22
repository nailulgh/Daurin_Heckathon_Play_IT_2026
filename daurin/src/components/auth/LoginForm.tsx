"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginSchema } from "@/lib/validators";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type LoginData = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginData>({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const parsed = LoginSchema.safeParse(formData);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setServerError("Invalid email or password.");
      } else {
        // Fetch session to get the actual user role from the database
        const { getSession } = await import("next-auth/react");
        const session = await getSession();
        
        const role = (session?.user as any)?.role;

        if (role === "PENGEPUL") {
          router.push("/pengepul/dashboard");
        } else if (role === "INDUSTRI") {
          router.push("/industri/dashboard");
        } else {
          router.push("/rumah-tangga/dashboard");
        }
        router.refresh();
      }
    } catch (err) {
      setServerError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <Link href="/" className="inline-flex items-center text-green-700 hover:text-green-900 mb-6 font-semibold transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Beranda
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6 p-8 md:p-10 bg-white rounded-2xl shadow-xl border border-green-50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-green-800 tracking-tight">Masuk Daurin</h2>
          <p className="text-gray-500 mt-2">Masuk untuk melanjutkan aktivitas daur ulang Anda</p>
        </div>

      {serverError && <div className="p-3 text-sm text-red-500 bg-red-50 rounded">{serverError}</div>}

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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors mt-4 shadow-sm"
      >
        {isLoading ? "Memproses..." : "Masuk"}
      </button>
      
      <div className="text-sm text-center mt-6 pt-6 border-t border-gray-100 text-gray-600">
        Belum punya akun? <Link href="/register" className="text-green-700 font-semibold hover:underline">Daftar di sini</Link>
      </div>
    </form>
  </div>
  );
}
