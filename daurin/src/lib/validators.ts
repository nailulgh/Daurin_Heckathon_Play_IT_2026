import { z } from "zod";

export const WasteTypeEnum = z.enum([
  "PLASTIK_PET",
  "PLASTIK_HDPE",
  "KERTAS_KARDUS",
  "LOGAM_KALENG",
  "KACA",
  "ELEKTRONIK",
]);

export const RoleEnum = z.enum([
  "RUMAH_TANGGA",
  "PENGEPUL",
  "INDUSTRI",
]);

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: RoleEnum,
  lat: z.number().optional(),
  lng: z.number().optional(),
  wasteTypesHandled: z.array(WasteTypeEnum).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const CreateWasteListingSchema = z.object({
  wasteType: WasteTypeEnum,
  weightKg: z.number().positive("Weight must be positive"),
  pricePerKg: z.number().positive("Price must be positive"),
  description: z.string().optional(),
  photoUrl: z.string().url().optional(),
  aiClassification: z.string().optional(),
});

export const CreateMaterialListingSchema = z.object({
  wasteType: WasteTypeEnum,
  purpose: z.string().min(1, "Purpose is required"),
  weightKg: z.number().positive("Weight must be positive"),
  pricePerKg: z.number().positive("Price must be positive"),
  photoUrl: z.string().url().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  sourceClaimId: z.string().optional(),
});

export const CreateOrderSchema = z.object({
  materialId: z.string().min(1, "Material ID is required"),
  volumeKg: z.number().positive("Volume must be positive"),
  buyerNote: z.string().optional(),
});

export const NegotiateSchema = z.object({
  type: z.enum(["OFFER", "COUNTER_OFFER", "DEAL", "CANCEL"]),
  amount: z.number().positive().optional(),
  message: z.string().optional(),
});
