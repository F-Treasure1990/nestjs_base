import { HttpException, HttpStatus } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

function formatZodErrors(error: ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  error.errors.forEach((e) => {
    if (e.path.length > 0) {
      formatted[e.path.join('.')] = e.message;
    }
  });
  return formatted;
}

export const GlobalZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) =>
    new HttpException(
      {
        message: 'Issue with object validation',
        errorCode: 'VALIDATION_ERROR',
        errors: formatZodErrors(error),
      },
      HttpStatus.BAD_REQUEST,
    ),
});
