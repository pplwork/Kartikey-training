import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req): any {
    return this.authService.login(req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Req() req): string {
    return req.user;
  }
}
