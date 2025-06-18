import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ImagekitService } from './imagekit/imagekit.service';
import { PrismaService } from './prisma/prisma.service';

import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    AuthModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, ImagekitService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/refresh', method: RequestMethod.POST },
      )
      .forRoutes('product', 'profile', AppController);
  }
}
