import {
  Controller,
  Post,
  Body,
  Patch,
  UnprocessableEntityException,
  Delete,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { BadRequestError } from '../errors/BadRequest.error';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create.dto';
import { UpdateUserDTO } from './dto/update.dto';
import { FilterUsersDTO, UsersDTO } from './dto/user.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

import { User } from './user.entity';
import { UUIDVersion } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um usuário',
  })
  @ApiBody({
    description: 'Dados do usuário criado.',
    type: CreateUserDTO,
  })
  @ApiCreatedResponse({
    description: 'Usuário criado.',
    type: UsersDTO,
  })
  @ApiBadRequestResponse({
    description: 'A requisição não combina com o esperado.',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Erro ao criar o paciente.',
    type: UnprocessableEntityException,
  })
  async createUser(@Body() createUser: CreateUserDTO): Promise<User> {
    return this.userService.create(createUser);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Recupera um usuário.',
  })
  @ApiResponse({
    description: 'Usuário atualizado.',
    type: UsersDTO,
  })
  @ApiParam({
    name: 'Id do usuário',
    example: 'c2fd0654-6f00-4d3d-a935-693979232eeb',
  })
  @ApiBadRequestResponse({
    description: 'A requisição não combina com o esperado.',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Erro ao criar o paciente.',
    type: UnprocessableEntityException,
  })
  async getUser(
    @Param('id') userId: UUIDVersion,
  ): Promise<User | UpdateResult> {
    return this.userService.find(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Recupera todos os usuário.',
  })
  @ApiResponse({
    description: 'Usuário atualizado.',
    type: () => Array<UsersDTO>,
  })
  async getAllUsers(@Query() queryFilter: FilterUsersDTO): Promise<User[]> {
    return this.userService.findAll(queryFilter);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Edita um usuário.',
  })
  @ApiParam({
    name: 'Id do usuário',
    example: 'c2fd0654-6f00-4d3d-a935-693979232eeb',
  })
  @ApiBody({
    description: 'Dados do usuário.',
    type: UpdateUserDTO,
  })
  @ApiResponse({
    description: 'Usuário atualizado.',
    type: UsersDTO,
  })
  @ApiBadRequestResponse({
    description: 'A requisição não combina com o esperado.',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Erro ao criar o paciente.',
    type: UnprocessableEntityException,
  })
  async updateUser(
    @Param('id') userId: UUIDVersion,
    @Body() updatedUser: UpdateUserDTO,
  ): Promise<User | UpdateResult> {
    return this.userService.update(userId, updatedUser);
  }

  // Here also needs to be an administrator do delete aa user
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Edita um usuário.',
  })
  @ApiParam({
    name: 'Id do usuário',
    example: 'c2fd0654-6f00-4d3d-a935-693979232eeb',
  })
  @ApiResponse({
    description: 'Confirmação de deleção.',
    type: DeleteResult,
  })
  @ApiBadRequestResponse({
    description: 'A requisição não combina com o esperado.',
    type: BadRequestError,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Erro ao criar o paciente.',
    type: UnprocessableEntityException,
  })
  async removeUser(
    @Param('id') userId: UUIDVersion,
  ): Promise<User | DeleteResult> {
    return this.userService.remove(userId);
  }
}
