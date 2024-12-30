import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { WrapDataInterceptor } from './util/interceptors/wrap-data/wrap-data.interceptor';
import { TimeoutInterceptor } from './util/interceptors/timeout/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);
  process.on('beforeExit', async () => {
    await app.close();
    await prismaService.$disconnect();
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  // app.useGlobalInterceptors(
  //   new WrapDataInterceptor(),
  //   new TimeoutInterceptor(),
  // );
  // app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from Next.js frontend
    credentials: true, // Allow cookies if needed
  });
  await app.listen(3001);
}
bootstrap();
