import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";
import { ServiceLayerError } from "./errors/ServiceException.error";

@Catch(ServiceLayerError)
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(`${HttpErrorFilter.name}/${ServiceLayerError.name}`);

  async catch(exception: ServiceLayerError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    this.logger.log(JSON.stringify(exception.extraInfo, null, 2));

    response.status(exception.statusCode).json({
      message: exception.message,
      name: exception.name,
      statusCode: exception.statusCode,
    });
  }
}
