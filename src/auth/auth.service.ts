import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  /**
   * Service for creating a new user
   *
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    // At first check is email exists or not
    const userWithEmail = await this.userService.findUserByEmail(
      createUserDto.email,
    );

    if (userWithEmail) {
      throw new BadRequestException('Sorry email already used');
    }

    // Then check username exists or not
    const userWithUsername = await this.userService.findUserByUsername(
      createUserDto.username,
    );

    if (userWithUsername) {
      throw new BadRequestException('Sorry username already used');
    }

    // If username and email are unique then register a new user with credentials
    const newUser = await this.userService.create(createUserDto);

    // Password reset link
    const activationLink = `http://localhost:3000/auth/active/${newUser.activationToken}`;

    // Send email
    await this.mailerService.sendMail({
      to: newUser.email,
      from: 'noreply@tstore.app',
      subject: '[TStore] Active Account',
      template: './activate_account',
      context: {
        activationLink: activationLink,
      },
    });

    // Send redirect response
    return {
      status: 'success',
      type: 'message',
      data: { message: 'Please check your email for reset link' },
    };
  }

  /**
   * By default after registration the account will be inactive
   *
   * So this service will be use to activate the account with activation token
   *
   * @param activationToken
   */
  async activateAccount(activationToken: string) {
    // At first check is token valid or not
    const user = await this.userService.findUserByActivationToken(
      activationToken,
    );

    if (!user) {
      throw new BadRequestException('Sorry token is invalid or expired');
    }

    // Update status
    await this.userService.changeAccountStatus(user, true);

    // Send response message
    return {
      status: 'success',
      type: 'message',
      data: { message: 'Your account successfully activated' },
    };
  }

  /**
   * Helper service to check is user exists with username and password
   *
   * @param username
   * @param password
   */
  async validateUser(username: string, password: string) {
    const user = await this.userService.validateUser(username, password);

    if (user && user.isActive) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  /**
   * Service for login to jwt with user object
   *
   * @param user
   */
  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Service for generate a password reset token and get reset email with that token
   *
   * @param email
   */
  async forgetPassword(email: string) {
    const user = await this.userService.generateResetToken(email);

    // Password reset link
    const passwordResetLink = `http://localhost:3000/auth/password_reset/${user.passwordResetToken}`;

    // Send email
    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@tstore.app',
      subject: '[TStore] Password reset',
      template: './password_reset',
      context: {
        passwordResetLink: passwordResetLink,
      },
    });

    // Send response message
    return {
      status: 'success',
      type: 'message',
      data: { message: 'Please check your email for reset link' },
    };
  }

  /**
   * Service for change the password with reset token
   *
   * @param token
   * @param newPassword
   */
  async updatePasswordWithToken(token: string, newPassword: string) {
    // Validate the token first
    const validateUser = await this.userService.validateToken(token);

    // If token validation is correct
    // update the password
    return await this.userService.updateUserPassword(validateUser, newPassword);
  }
}
