import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign, verify } from 'jsonwebtoken';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly userService: UsersService,
  ) {}

  async login(
    userName: string,
    password: string,
    values: { userAgent: string; ipAddress: string },
  ): Promise<{ accessToken: string; refreshToken: string } | undefined> {
    const user = await this.userService.findUser(userName);
    //TODO to add hash
    if (user.password !== password) {
      throw new BadRequestException('User not found!');
    }
    return this.newRefreshAndAccessToken(user, values);
  }

  private async newRefreshAndAccessToken(
    user: User,
    values: { userAgent: string; ipAddress: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const newdata = this.refreshTokenRepository.create({
      userId: user.id,
      ...values,
    });

    return {
      refreshToken: newdata.sign(),
      accessToken: sign({ userId: user.id }, process.env.ACCESS_SECRET, {
        expriresIn: '1h',
      }),
    };
  }

  async refresh(refreshStr: string): Promise<string | undefined> {
    return undefined;
  }

  private retriveRefreshToken(
    refreshStr: string,
  ): Promise<RefreshToken | undefined> {
    try {
      const decode = verify(refreshStr, process.env.REFRESH_SECRET);
      if (typeof decode === 'string') {
        return undefined;
      }
      return Promise.resolve(
        this.refreshTokenRepository.find((token) => token.id === decode.id),
      );
    } catch (e) {
      return undefined;
    }
  }
}
