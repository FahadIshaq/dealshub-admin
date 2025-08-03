import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Injectable()
export class InvestorGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token required');
    }

    try {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            const payload = this.jwtService.verify(token) as JwtPayload;

      // Check if the user is an investor
      if (payload.role !== 'investor') {
        throw new UnauthorizedException(
          'Access denied. Investor role required.',
        );
      }

      // Attach user info to request
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 