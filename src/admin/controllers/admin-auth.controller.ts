import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminLoginDto } from '../dtos/admin-login.dto';
import { ApiResponseDto } from '../../shared/dtos/api-response.dto';
import { AdminSessionResponseDto } from '../dtos/admin-session.response.dto';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body() dto: AdminLoginDto,
  ): Promise<ApiResponseDto<AdminSessionResponseDto>> {
    const token = await this.adminAuthService.loginWithPassword(dto.password);
    return {
      statusCode: 700,
      message: 'Login successful.',
      data: { token },
    };
  }
}

