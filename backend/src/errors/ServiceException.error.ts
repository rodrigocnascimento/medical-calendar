import { HttpException, HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { PostgresErrorCode } from "../database/typeorm.pgsql-errors.enum";

export class ServiceException {
  @ApiProperty({
    description: "O código do erro.",
    example: HttpStatus.BAD_REQUEST,
  })
  statusCode: HttpStatus;

  @ApiProperty({
    description: "Nome da class3.",
    example: HttpException.name,
  })
  name: string;

  @ApiProperty({
    description: "Mensagem(s) de erro.",
    example: `[
      {
        "name": [
          "Campo nome deve ser preenchido."
        ]
      }
    ]`,
  })
  message: Array<{ [key: string]: string[] }>;

  @ApiProperty({
    description: "Property that uses a internal code",
    example: PostgresErrorCode.unique_violation,
  })
  errorCode: PostgresErrorCode | string | number | unknown;
}

export class ServiceLayerError {
  readonly message: Array<{ [key: string | number]: Array<string> }> = [];
  readonly name: string = "ServiceLayerError";
  readonly extraInfo: PostgresErrorCode | string | number | unknown;
  readonly statusCode: number;

  constructor(statusCode: HttpStatus, message?: any, extraInfo?: unknown) {
    this.message = message || "Service Layer Internal Server Error";
    this.extraInfo = extraInfo || "unknown";
    this.statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
