import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { ImagekitService } from './imagekit/imagekit.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, ProductModule],
  controllers: [AppController],
  providers: [AppService, ImagekitService, PrismaService],
})
export class AppModule {}
