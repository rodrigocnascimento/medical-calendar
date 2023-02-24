import { Controller, Request, Post, UseGuards, Get, UnauthorizedException } from "@nestjs/common";
import { LocalAuthGuard } from "./auth/local.guard";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/jwt.guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AuthDTO, BearerTokenDTO } from "./auth/dto/auth.dto";

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

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
  async login(@Request() req: any) {
    console.log(req.user);
    return this.authService.login(req.user);
  }

  @Get("/")
  async public() {
    return "Hello World";
  }

  @ApiOperation({
    summary: "Apenas para validar o token o login de um usuário.",
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
