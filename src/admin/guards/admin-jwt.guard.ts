import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = (req.headers?.authorization || '') as string;

    const [type, token] = auth.split(' ');
    if (type !== 'Bearer' || !token) throw new UnauthorizedException('Missing admin token.');

    try {
      const payload: any = this.jwtService.verify(token);
      if (!payload || payload.role !== 'ADMIN') throw new UnauthorizedException('Invalid admin token.');
      req.admin = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid admin token.');
    }
  }
}

