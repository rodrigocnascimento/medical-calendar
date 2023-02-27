import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  UnauthorizedException,
  NotFoundException,
  Param,
  Inject,
} from "@nestjs/common";
import { LocalAuthGuard } from "./auth/local.guard";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt.guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AuthDTO, BearerTokenDTO } from "./auth/dto/auth.dto";
import { PatientsService } from "./patients/patients.service";

@Controller()
export class AppController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,

    @Inject(PatientsService)
    private patientService: PatientsService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  @ApiOperation({
    summary: "Realiza o login de um usuário.",
  })
  @ApiBody({
    description: "Credenciais do usuário.",
    type: AuthDTO,
  })
  @ApiOkResponse({
    description: "Bearer token.",
    type: BearerTokenDTO,
  })
  @ApiNotFoundResponse({
    description: "Paciente não econtrado.",
    type: UnauthorizedException,
  })
  @ApiTags("Login")
  async login(@Request() req: AuthDTO) {
    return this.authService.login(req.user);
  }

  @Get("lgpd/deletion/:patientId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "Busca um paciente pelo seu id",
  })
  @ApiParam({
    name: "patientId",
    type: String,
    description: "O Id do paciente",
  })
  @ApiOkResponse({
    description: "Paciente encontrado.",
    type: String,
  })
  @ApiNotFoundResponse({
    description: "Paciente não econtrado.",
    type: NotFoundException,
  })
  async lgpdDeletion(@Param("patientId") patientId: string) {
    return this.patientService.lgpdDeletion(patientId);
  }

  @Get("lgpd/recover/:patientId")
  @ApiOperation({
    summary: "Busca um paciente pelo seu id",
  })
  @ApiParam({
    name: "patientId",
    type: String,
    description: "O Id do paciente",
  })
  @ApiOkResponse({
    description: "Paciente encontrado.",
    type: String,
  })
  @ApiNotFoundResponse({
    description: "Paciente não econtrado.",
    type: NotFoundException,
  })
  async lgpdRecover(@Param("patientId") patientId: string) {
    return this.patientService.lgpdDeletion(patientId);
  }

  @Get("/")
  async public() {
    return "Hello World";
  }

  @ApiOperation({
    summary: "Apenas para validar o token gerado.",
  })
  @ApiOkResponse({
    description: "PING-PONG.",
  })
  @Get("/private-route")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  async _private() {
    return "PONG";
  }
}
