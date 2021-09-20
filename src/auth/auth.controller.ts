import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserSerializer } from '../interceptor/user.serialize.interceptor';

@UserSerializer()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/active/:activationToken')
  activateAccount(@Param('activationToken') activationToken: string) {
    return this.authService.activateAccount(activationToken);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('/forget_password')
  async forgetPassword(@Body('email') email: string) {
    return this.authService.forgetPassword(email);
  }

  @Post('/password_reset/:token')
  async passwordResetWithToken(
    @Param('token') token: string,
    @Body('password') newPassword: string,
  ) {
    return this.authService.updatePasswordWithToken(token, newPassword);
  }
}
