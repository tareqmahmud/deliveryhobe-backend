import { Exclude } from 'class-transformer';

export class UserDto {
  @Exclude()
  password: string;

  @Exclude()
  activationToken: string;

  @Exclude()
  activationExpiry: number;

  @Exclude()
  passwordResetToken: string;

  @Exclude()
  passwordResetExpiry: number;
}
