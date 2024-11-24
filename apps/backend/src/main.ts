import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  process.on('beforeExit', async () => {
    await app.close();
    await prismaService.$disconnect();
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from Next.js frontend
    credentials: true, // Allow cookies if needed
  });
  await app.listen(3001);
}
bootstrap();
