import { Injectable } from '@nestjs/common';
import { users } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    email: string,
    name: string,
    password: string,
  ): Promise<users> {
    return await this.prisma.users.create({
      data: { email, name, password },
    });
  }
  async getUserByEmail(email: string): Promise<users> {
    return await this.prisma.users.findFirstOrThrow({
      where: { email },
    });
  }
  async generateTokens(
    user: users,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    );

    await this.prisma.users.update({
      where: { email: user.email },
      data: { refresh_token: refreshToken },
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      interface DecodedToken {
        userId: number;
      }

      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET!,
      ) as DecodedToken;

      const user = await this.prisma.users.findUniqueOrThrow({
        where: { id: decoded.userId.toString() },
      });

      if (!user) {
        return null;
      }

      return this.generateTokens(user);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
