import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/user.entity";
import * as bcrypt from "bcrypt";
import { UsersDTO } from "src/users/dto/user.dto";

export const jwtConstants = {
  secret: "05e9eadd-d1c7-490c-a74f-0f8ec2b67beb",
};

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(userEmail: string, pass: string): Promise<Omit<User, "password">> {
    const user = await this.usersService.findOne(userEmail);

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (user && isPasswordValid) {
      // eslint-disable-next-line
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UsersDTO) {
    const payload = {
      sub: user.id,
      userEmail: user.email,
      userName: user.name,
      userRole: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
