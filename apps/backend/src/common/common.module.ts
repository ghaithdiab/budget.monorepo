import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [
    // {provide :APP_GUARD , useClass : AuthGuard },
  ],
  imports: [AuthModule],
})
export class CommonModule {}
