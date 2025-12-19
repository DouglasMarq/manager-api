import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string): Promise<User | null> {
    const user = await this.userService.findByLogin(login);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      userId: user.id,
      name: user.name,
      role: user.role,
      companyRef: user.companyRef?.companyRef,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        sub: user.id,
        userId: user.id,
        name: user.name,
        role: user.role,
        companyRef: user.companyRef?.companyRef,
      },
    };
  }
}
