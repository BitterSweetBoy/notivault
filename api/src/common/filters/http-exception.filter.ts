import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx    = host.switchToHttp();
    const res    = ctx.getResponse<Response>();
    const req    = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Obtener la respuesta original de exception (puede venir string o objeto)
    const response = exception instanceof HttpException
      ? exception.getResponse()
      : null;

    // Determinar message y errors
    let message: string;
    let errors: Record<string, string[]> | null = null;

    if (typeof response === 'string') {
      message = response;
    } else if (response && typeof response === 'object') {
      // class-validator suele devolver { message: string[] }
      const body = response as any;
      if (Array.isArray(body.message)) {
        message = 'Validation error';
        errors = { validation: body.message };
      } else {
        message = (body.message as string) || exception.message;
        errors = (body.error && typeof body.error === 'object')
          ? (body.error as Record<string, string[]>)
          : null;
      }
    } else {
      message = exception.message || 'Internal server error';
    }

    const result: ApiResponse<null> = {
      success: false,
      message,
      data: null,
      errors,
    };

    res.status(status).json(result);
  }
}
