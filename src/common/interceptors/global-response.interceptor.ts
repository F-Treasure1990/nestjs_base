import { RESPONSE_MESSAGE_METADATA } from '@/common/decorators/response-message.decorator';
import { IGlobalResponse } from '@/common/types';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { format } from 'date-fns';
import { FastifyReply, FastifyRequest } from 'fastify';
import { map, Observable } from 'rxjs';

export interface IGlobalInterceptor<T> extends IGlobalResponse {
  message?: string;
  data: T;
}

@Injectable()
export class GlobalReponseInterceptor<T>
  implements NestInterceptor<T, IGlobalInterceptor<T>>
{
  reflector = new Reflector();

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IGlobalInterceptor<T>> {
    return next
      .handle()
      .pipe(map((res: T) => this.globalResponseHandler(res, context)));
  }

  globalResponseHandler(
    res: T,
    context: ExecutionContext,
  ): IGlobalInterceptor<T> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const statusCode = response.statusCode;

    if (res === 'object' || res === 'array') {
      console.log('is object');
    }

    return {
      method: request.method,
      success: true,
      path: request.url,
      statusCode,
      timestamp: format(new Date().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
      message: this.reflector.get<string>(
        RESPONSE_MESSAGE_METADATA,
        context.getHandler(),
      ),
      data: res,
    };
  }
}
