import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/user.entity";

export const jwtConstants = {
  secret: "05e9eadd-d1c7-490c-a74f-0f8ec2b67beb",
};

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(userEmail: string, pass: string): Promise<Omit<User, "password">> {
    const user = await this.usersService.findOne(userEmail);
    if (user && user.password === pass) {
      // eslint-disable-next-line
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
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
