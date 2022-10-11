import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.name === 'UnprocessableEntityException') {
      const status = exception.getStatus() || 422;
      response.status(status).json({
        success: false,
        data: { error: exception.getResponse()['message'] },
        statusCode: status,
      });
    } else if (exception.name === 'Bad Request') {
      const status = exception.getStatus() || 400;
      response.status(status).json({
        success: false,
        data: { error: exception.getResponse()['message'] },
        statusCode: status,
      });
    } else {
      const statusCode = exception.statusCode || exception.status || 500;
      response.status(statusCode).json({
        success: false,
        data: { error: exception.data.error },
        statusCode,
      });
    }
  }
}
