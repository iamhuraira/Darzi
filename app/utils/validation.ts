import { z } from "zod";

export const ownerSignupSchema = z
  .object({
    name: z.string().min(1, "Name is required").min(3, "Name must be at least 3 characters"),
    phone: z
      .string()
      .min(1, "Phone is required")
      .refine((v) => /^[\d\s\-+]+$/.test(v.replace(/\s/g, "")) && (v.replace(/\D/g, "").length === 11 || v.replace(/\D/g, "").length === 12), "Valid Pakistani phone (03XX-XXXXXXX or 11 digits)"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/\d/, "Password must contain at least 1 number"),
    confirmPassword: z.string().min(1, "Confirm password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type OwnerSignupInput = z.infer<typeof ownerSignupSchema>;

export const shopRegistrationSchema = z.object({
  shopName: z.string().min(1, "Shop name is required").min(3, "Shop name must be at least 3 characters"),
  shopPhone: z
    .string()
    .min(1, "Shop phone is required")
    .refine((v) => /^[\d\s\-+]+$/.test(v.replace(/\s/g, "")) && (v.replace(/\D/g, "").length >= 10), "Valid phone number"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required").min(10, "Address must be at least 10 characters"),
  description: z.string().max(500).optional().default(""),
});

export type ShopRegistrationInput = z.infer<typeof shopRegistrationSchema>;

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .refine((v) => /^\d+$/.test(v.replace(/\D/g, "")) && v.replace(/\D/g, "").length === 11, "Phone must be 11 digits"),
  address: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});
export type CustomerInput = z.infer<typeof customerSchema>;
