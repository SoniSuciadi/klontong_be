import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: RegisterDto, @Res() res: Response) {
    try {
      const { email, name, password, confirmPassword } = createUserDto;

      if (password !== confirmPassword) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Passwords do not match' });
      }
      const user = await this.authService.createUser(email, name, password);

      return res.status(HttpStatus.CREATED).json({
        message: 'User created successfully',
        user,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error creating user',
        error: error,
      });
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const { email, password } = loginDto;
      const user = await this.authService.getUserByEmail(email);

      if (!user || user.password !== password) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Invalid credentials' });
      }

      const { accessToken, refreshToken } =
        await this.authService.generateTokens(user);
      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error during login',
        error: error,
      });
    }
  }
}
