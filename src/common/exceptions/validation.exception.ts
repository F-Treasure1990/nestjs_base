import { BaseException } from '@/common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class ValidationExeption extends BaseException {
  constructor(message: string, errors?: any) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      'VALIDATION_ERROR',
      'warning',
      errors,
    );
  }
}
