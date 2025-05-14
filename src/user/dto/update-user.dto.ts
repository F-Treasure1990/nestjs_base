import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateUserSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    fullName: z.string().optional(),
    blocked: z.boolean().optional(),
    roleId: z.string().uuid().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided',
  });

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
