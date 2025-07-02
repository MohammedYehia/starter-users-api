import { z } from "zod";
import { isValidObjectId } from "mongoose";

export const objectIdSchema = z.string().refine((val) => isValidObjectId(val), {
  message: "Invalid Id",
});

export const userIdParamSchema = z.object({
  id: objectIdSchema,
});
