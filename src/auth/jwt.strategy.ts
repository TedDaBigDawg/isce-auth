// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { jwtSecret } from 'src/utils/constants';
// import { Request } from 'express';
// import { UserService } from 'src/user/user.service';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private usersService: UserService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         JwtStrategy.extractJWT,
//       ]),
//       ignoreExpiration: false,
//       secretOrKey: process.env.JWT_SECRET,
//     });
//   }

//   private static extractJWT(req: Request): string | null {
//     if (req.cookies && 'token' in req.cookies) {
//       return req.cookies.token;
//     }
//     return null;
//   }

//   async validate(payload: { id: string; email: string, username: string, password: string }) {
//     console.log('JWT Payload:', payload);
//     const user = await this.usersService.getUserById(payload.id);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     return user;
//   }
// }