import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

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
        data: {
          id: user.id,
        },
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

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Invalid credentials' });
      }

      const { accessToken, refreshToken } =
        await this.authService.generateTokens(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: process.env.NODE_ENV == 'production',
        sameSite: 'lax',
        secure: process.env.NODE_ENV == 'production',
        path: '/',
        domain:
          process.env.NODE_ENV == 'production' ? process.env.COOKIE_DOMAIN : '',
      });
      console.log({
        httpOnly: process.env.NODE_ENV == 'production',
        sameSite: 'lax',
        secure: process.env.NODE_ENV == 'production',
        path: '/',
        domain:
          process.env.NODE_ENV == 'production' ? process.env.COOKIE_DOMAIN : '',
      });

      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error during login',
        error: error,
      });
    }
  }
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const { cookies } = req;
    const refreshToken = cookies.refreshToken as string;
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }
    const token = await this.authService.refreshTokens(refreshToken);
    res.cookie('refreshToken', token?.refreshToken, {
      httpOnly: process.env.NODE_ENV == 'production',
      sameSite: 'lax',
      secure: process.env.NODE_ENV == 'production',
      path: '/',
      domain:
        process.env.NODE_ENV == 'production' ? process.env.COOKIE_DOMAIN : '',
    });
    console.log({
      httpOnly: process.env.NODE_ENV == 'production',
      sameSite: 'lax',
      secure: process.env.NODE_ENV == 'production',
      path: '/',
      domain:
        process.env.NODE_ENV == 'production' ? process.env.COOKIE_DOMAIN : '',
    });

    res.status(HttpStatus.OK).json({
      message: 'Success refresh',
      data: {
        accessToken: token?.accessToken,
      },
    });
  }
}
