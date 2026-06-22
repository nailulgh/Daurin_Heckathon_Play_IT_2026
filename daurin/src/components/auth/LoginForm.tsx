"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoginSchema } from "@/lib/validators";
import { z } from "zod";

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
        const emailLower = formData.email.toLowerCase();
        if (emailLower.includes("pengepul")) {
          router.push("/pengepul/dashboard");
        } else if (emailLower.includes("industri")) {
          router.push("/industri/dashboard");
        } else {
          // Default to Rumah Tangga for "budi@gmail.com" or others
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 text-center mb-6">Masuk Daurin</h2>

      {serverError && <div className="p-3 text-sm text-red-500 bg-red-50 rounded">{serverError}</div>}

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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-700 text-white font-semibold py-2 rounded hover:bg-green-800 disabled:opacity-50"
      >
        {isLoading ? "Masuk..." : "Masuk"}
      </button>
      
      <div className="text-sm text-center mt-4">
        Belum punya akun? <a href="/auth/register" className="text-green-700 hover:underline">Daftar di sini</a>
      </div>
    </form>
  );
}
