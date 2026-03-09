import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../const';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AdminJwtGuard } from './guards/admin-jwt.guard';
import { AdminAuthService } from './services/admin-auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ADMIN_JWT_SECRET || jwtConstants.adminSecret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminJwtGuard],
  exports: [AdminJwtGuard, JwtModule],
})
export class AdminModule {}

