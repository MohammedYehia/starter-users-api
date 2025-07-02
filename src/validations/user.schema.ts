import { z } from "zod";
import { objectIdSchema } from "./common.schema";

export const createUserSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  photoUrl: z.string().url().optional(),
});

export const userSchema = z.object({
  id: objectIdSchema,
  name: z.string(),
  email: z.string().email(),
  photoUrl: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UserDto = z.infer<typeof userSchema>;
export type loginDto = z.infer<typeof loginSchema>;
