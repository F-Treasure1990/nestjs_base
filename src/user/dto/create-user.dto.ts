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
      .max(100)
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character',
      ),
    confirmPassword: z.string(),
  })
  .required()
  .strip()
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
