import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request);
    console.log(request.headers.authorization);
    // const token = this.extractTokenFromHeader(request);

    const authHeader = request.headers.authorization;

    // console.log('token:', token);
    // if (!token) {
    //   throw new UnauthorizedException('No token provided');
    // }

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }


    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader;

    // Attach the token to the request for further processing
    request.headers.authorization = token;

    // try {
      // Decode and verify the JWT token
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      console.log('decoded:', decoded);
      request.user = decoded;  // Attach the decoded user to the request object
      console.log(request.user);
      return true;
    // } catch (error) {
    //   throw new UnauthorizedException('Invalid token');
    // }
  }

  private extractTokenFromHeader(request): string | null {
    // const authHeader = request.headers.authorization.split(' ')[1] || null;
    // if (!authHeader) {
    //   return undefined;
    // }
    return request.headers.authorization || null;
  }
}
