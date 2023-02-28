import {
  Body,
  Controller,
  Delete,
  Ip,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import RefreshTokenDto from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Req() request, @Ip() ip: string, @Body() body: LoginDto) {
    return this.authService.login(body.username, body.password, {
      ipAddress: ip,
      userAgent: request.headers['user-agent'],
    });
  }
  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@Body() body: RefreshTokenDto) {
    this.authService.logout(body.refreshToken);
  }
}
