import { BaseException } from '@/common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends BaseException {
  constructor(resourceType: string, identifier: string | number) {
    super(
      `${resourceType} with identifier ${identifier} not found`,
      HttpStatus.NOT_FOUND,
      'RESOURCE_NOT_FOUND',
    );
  }
}
