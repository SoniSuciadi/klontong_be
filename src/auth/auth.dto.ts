import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
