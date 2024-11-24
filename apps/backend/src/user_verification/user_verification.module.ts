import { Module } from '@nestjs/common';
import { UserVerificationController } from './user_verification.controller';
import { UserVerificationService } from './user_verification.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports:[ConfigModule],
  controllers: [UserVerificationController],
  providers: [UserVerificationService ,PrismaService],
})
export class UserVerificationModule {}
