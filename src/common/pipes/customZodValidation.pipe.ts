import { ValidationExeption } from '@/common/exceptions/validation.exception';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

function formatZodErrors(error: ZodError) {
  // Create an object with path as key and first error message as value
  const errors = error.errors.reduce(
    (acc, err) => {
      const field = err.path.join('.');
      // Only set the field if it doesn't already exist (taking the first error only)
      if (!acc[field]) {
        acc[field] = err.message;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return errors;
}

export const CustomZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) =>
    new ValidationExeption('Validation failed', formatZodErrors(error)),
});
