import { IGlobalResponse } from '@/common/types';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

export interface IExceptionFilter extends IGlobalResponse {
  error?: string | object;
  message?: string;
}

@Catch()
export class GlobalExceptionFilter<T extends HttpException>
  implements ExceptionFilter
{
  catch(exception: T | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Handle the response data more carefully
    let _error: string | object = { message: 'Internal Server Error' };

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      _error =
        typeof exceptionResponse === 'object'
          ? { ...exceptionResponse }
          : { _error: exceptionResponse };
    } else if (exception instanceof Error) {
      _error = { message: exception.message };
    }

    const errorResponse: IExceptionFilter = {
      success: false,
      statusCode,
      method: request.method,
      path: request.url,
      timestamp: new Date().toISOString(),
      ..._error,
    };

    // json can be used instead of send(fastify)
    response.status(statusCode).send(errorResponse);

    const _error_log = `[GlobalException] ${new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'short',
      timeStyle: 'medium',
      hour12: true,
    })
      .format(new Date())
      .toUpperCase()}   ERROR [GlobalException] ${exception.name}: ${exception.message}`;
    // Still logs to terminal
    console.error(_error_log);
  }
}
