import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers['authorization'];

      if (typeof authHeader !== 'string') {
        throw new UnauthorizedException('Invalid authorization header');
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Invalid token format');
      }

      const decoded = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      req.user = {
        id: decoded.id,
      };

      next();
    } catch (error: unknown) {
      console.error('Authentication error:', error);

      let errorMessage = 'Unauthorized';
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          errorMessage = 'Token expired';
        } else if (error.name === 'JsonWebTokenError') {
          errorMessage = 'Invalid token';
        }
      }

      throw new UnauthorizedException(errorMessage);
    }
  }
}
