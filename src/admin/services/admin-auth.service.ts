import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { constantsAppSettings } from '../../const';
import { IAdminSessionPayload } from '../interfaces/admin-session-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async loginWithPassword(password: string): Promise<string> {
    const stored = (constantsAppSettings.adminPanelPassword || '').trim();
    if (!stored) {
      throw new UnauthorizedException('Admin password is not configured in settings.');
    }

    const incoming = (password || '').trim();
    if (!incoming) throw new UnauthorizedException('Invalid password.');

    const isBcryptHash = stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$');

    const ok = isBcryptHash ? await bcrypt.compare(incoming, stored) : incoming === stored;
    if (!ok) throw new UnauthorizedException('Invalid password.');

    const payload: IAdminSessionPayload = { role: 'ADMIN' };
    return this.jwtService.sign(payload);
  }
}

