import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateUserSchema = z
  .object({
    username: z.string(),
    email: z.string().email(),
    fullName: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((val) => /[0-9]/.test(val), {
        message: 'Password must contain at least one number',
      })
      .refine((val) => /[^a-zA-Z0-9]/.test(val), {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: z.string(),
  })
  .required()
  .strip()
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
