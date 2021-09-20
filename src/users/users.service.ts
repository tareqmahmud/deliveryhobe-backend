import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as dayjs from 'dayjs';
import * as crypto from 'crypto';
import { LessThan, Not } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  /**
   * Service for creating a new user with CreateUserDto Object
   *
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    // Create new user object
    const newUser = this.usersRepository.create(createUserDto);

    // Hashed password
    newUser.password = await this.usersRepository.hashedPassword(
      newUser.password,
    );

    // Generate activation token
    const activationToken = crypto.randomBytes(16).toString('hex');
    const activationExpiry = dayjs().add(1, 'day').unix();

    // Set activation token and expiry to DB
    newUser.activationToken = activationToken;
    newUser.activationExpiry = activationExpiry;

    // Save the new user to DB
    await this.usersRepository.save(newUser);

    // Return the user object without password
    return newUser;
  }

  /**
   * Service for validate a user with username and password
   *
   * @param username
   * @param password
   */
  async validateUser(username: string, password: string) {
    const user = await this.usersRepository.findOne({ username });

    // Username correct
    if (user) {
      // Check is password correct or not
      const validatePassword = await this.usersRepository.validatePassword(
        password,
        user.password,
      );

      if (validatePassword) {
        return user;
      }
    }

    return null;
  }

  /**
   * Helper method to find a user using email
   *
   * @param email
   */
  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      email,
    });

    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * Helper method to find a user using username
   *
   * @param username
   */
  async findUserByUsername(username: string) {
    const user = await this.usersRepository.findOne({
      username,
    });

    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * Helper method to find a user using account activation token
   *
   * @param activationToken
   */
  async findUserByActivationToken(activationToken: string) {
    const user = await this.usersRepository.findOne({
      activationToken,
      activationExpiry: Not(LessThan(dayjs().unix())),
    });

    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * Service for generate a unique password reset token to change the password
   *
   * @param email
   */
  async generateResetToken(email: string) {
    // At first find out the user
    const user = await this.findUserByEmail(email);

    // If email doesn't exists then throw an error
    if (!user) {
      throw new UnprocessableEntityException("Sorry the email doesn't exists");
    }

    // If user is exists then generate a token and save it to DB
    const passwordResetToken = crypto.randomBytes(16).toString('hex');
    const passwordResetExpiry = dayjs().add(1, 'day').unix();

    // Update value to DB
    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpiry = passwordResetExpiry;

    // Save data to DB
    await this.usersRepository.save(user);

    // return token and expiry
    const { password, ...result } = user;

    return result;
  }

  /**
   * Service for validate a token
   *
   * @param token
   */
  async validateToken(token: string) {
    const user = await this.usersRepository.findOne({
      passwordResetToken: token,
      passwordResetExpiry: Not(LessThan(dayjs().unix())),
    });

    // Is user is not available then throw an error
    if (!user) {
      throw new UnprocessableEntityException(
        'Sorry! token is invalid or token is expired',
      );
    }

    // If user is available the remove the token and expiry first
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;
    await this.usersRepository.save(user);

    // Return the user
    const { password, ...result } = user;

    return result;
  }

  /**
   * Service for change password existing user
   *
   * @param user
   * @param newPassword
   */
  async updateUserPassword(user, newPassword) {
    // Hash new password
    user.password = await this.usersRepository.hashedPassword(newPassword);

    // Save new password
    await this.usersRepository.save(user);

    // Return the user
    // Return the user
    const { password, ...result } = user;

    return result;
  }

  /**
   * Service for change account activation status
   *
   * @param user
   * @param status
   */
  async changeAccountStatus(user: User, status: boolean) {
    user.isActive = status;
    user.activationToken = null;
    user.activationExpiry = null;

    await this.usersRepository.save(user);

    return user;
  }
}
