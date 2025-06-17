import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }

    const message =
      exception instanceof Error ? exception.message : 'Internal server error';
    const stack = exception instanceof Error ? exception.stack : undefined;

    this.logger.error(message, stack);

    response.status(status).json({
      statusCode: status,
      message: message,
      ...(process.env.NODE_ENV === 'development' ? { stack } : {}),
    });
  }
}
