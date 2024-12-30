import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { EstablishmentsModule } from './establishments/establishments.module';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomesModule } from './incomes/incomes.module';
import { UserSettingsModule } from './user_settings/user_settings.module';
import { AuthModule } from './auth/auth.module';
import { UserVerificationModule } from './user_verification/user_verification.module';
import { CommonModule } from './common/common.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './common/auth/roles.guard';
import { ConfigModule } from '@nestjs/config';
@Module({
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ClassSerializerInterceptor,
    // },
  ],
  exports: [PrismaService],
  imports: [
    UsersModule,
    EstablishmentsModule,
    ExpensesModule,
    IncomesModule,
    UserSettingsModule,
    AuthModule,
    UserVerificationModule,
    CommonModule,
    ConfigModule,
  ],
})
export class AppModule {}
