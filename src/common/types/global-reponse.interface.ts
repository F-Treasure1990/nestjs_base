import { HTTPMethods } from 'fastify';

export interface IGlobalResponse {
  success: boolean;
  statusCode: number;
  method: HTTPMethods;
  path: string;
  timestamp: string;
}
