import { PartialType } from "@nestjs/swagger";
import { CreateUserDTO } from "./create.dto";

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
