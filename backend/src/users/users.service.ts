import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dto/create.dto';
import { UpdateUserDTO } from './dto/update.dto';
import { UUIDVersion } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findOne(userEmail: string): Promise<User> {
    return this.usersRepo.findOneOrFail({
      where: {
        email: userEmail,
      },
    });
  }

  async create(user: CreateUserDTO): Promise<User> {
    return await this.usersRepo.save(user);
  }

  async update(
    userId: UUIDVersion,
    user: UpdateUserDTO,
  ): Promise<User | UpdateResult> {
    return await this.usersRepo.update(userId, user);
  }

  async remove(userId: UUIDVersion): Promise<User | DeleteResult> {
    return await this.usersRepo.delete(userId);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  async find(userId: UUIDVersion): Promise<User> {
    return await this.usersRepo.findOne({
      where: {
        id: userId as string,
      },
    });
  }
}
