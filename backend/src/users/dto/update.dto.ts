import { OmitType, PartialType } from '@nestjs/swagger';
import { UsersDTO } from './user.dto';

export class UpdateUserDTO extends PartialType(
  OmitType(UsersDTO, ['id'] as const),
) {}
