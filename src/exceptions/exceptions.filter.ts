import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { Response } from 'express';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  constructor(private readonly i18n: I18nService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'INTERNAL_SERVER_ERROR';

    if (isHttpException) {
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message;
    } else if (exception instanceof Error) {
      // Check if it's a database error
      if (this.isDatabaseError(exception)) {
        this.logger.error(`Database error: ${exception.message}`);
        message = this.mapDatabaseError(exception);
      } else {
        this.logger.error(
          `Unexpected error: ${exception.message}`,
          exception.stack,
        );
        message = 'INTERNAL_SERVER_ERROR';
      }
    }

    const lang = I18nContext.current()?.lang || 'en';

    const translatedMessage = this.i18n.t(`translation.${message}`, { lang });

    response.status(status).json({
      statusCode: status,
      message: translatedMessage,
    });
  }

  private isDatabaseError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    return (
      errorMessage.includes('violates foreign key constraint') ||
      errorMessage.includes('duplicate key value') ||
      errorMessage.includes('unique constraint') ||
      errorMessage.includes('not-null constraint') ||
      errorMessage.includes('insert into') ||
      (errorMessage.includes('update') && errorMessage.includes('relation'))
    );
  }

  private mapDatabaseError(error: Error): string {
    const errorMessage = error.message;

    if (errorMessage.includes('violates foreign key constraint')) {
      return 'DATABASE.FOREIGN_KEY_VIOLATION';
    }
    if (
      errorMessage.includes('duplicate key value') ||
      errorMessage.includes('unique constraint')
    ) {
      return 'DATABASE.DUPLICATE_KEY';
    }
    if (errorMessage.includes('not-null constraint')) {
      return 'DATABASE.NOT_NULL_VIOLATION';
    }

    return 'DATABASE.ERROR';
  }
}
