import { User } from '@/user/entities/user.entity';
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { FastifyReply } from 'fastify/types/reply';
import { omit } from 'lodash';
import { map, Observable } from 'rxjs';

interface IResponse<T> {
  success: boolean;
  statusCode: HttpStatus;
  message: string;
  timeStamp: string;
  data: T | T[];
}

interface IControllerResponse {
  response: User | User[];
  message: string;
}

@Injectable()
export class UserInterceptor<T extends User | User[]>
  implements NestInterceptor<IControllerResponse, IResponse<T>>
{
  private defaultOmit: Array<keyof User> = ['password', 'updatedAt'];

  intercept(
    context: ExecutionContext,
    next: CallHandler<IControllerResponse>,
  ): Observable<IResponse<T>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<FastifyRequest>();
    const res = httpContext.getResponse<FastifyReply>();

    return next.handle().pipe(
      map((data: IControllerResponse) => {
        const { response, message } = data;

        const transformedData = Array.isArray(response)
          ? (response.map((user) => omit(user, this.defaultOmit)) as T)
          : (omit(response, this.defaultOmit) as T);

        return {
          method: req.method,
          success: true,
          statusCode: res.statusCode,
          message: message || `${req.routeOptions?.url || req.url} success`,
          path: req.url,
          data: transformedData,
          timeStamp: new Date().toISOString(),
        };
      }),
    );
  }
}
