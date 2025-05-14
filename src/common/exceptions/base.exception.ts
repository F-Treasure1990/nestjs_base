import { HttpException, HttpStatus } from '@nestjs/common';

type ErrorSeverity =
  | 'debug'
  | 'info'
  | 'warning'
  | 'error'
  | 'critical'
  | 'fatal';

export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    public readonly errorCode: string,
    public readonly severity?: ErrorSeverity,
    _errors?: any,
  ) {
    super(
      {
        message,
        errorCode,
        severity,
        timestamp: new Date().toISOString(),
        _errors,
      },
      statusCode,
    );
  }
}
