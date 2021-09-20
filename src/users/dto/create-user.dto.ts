import { IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}
