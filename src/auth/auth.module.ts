import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { jwtSecret } from 'src/utils/constants';
import { DatabaseModule } from 'src/database/database.module';
import { MailService } from './mail.service';
// import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';


@Module({
  imports: [PassportModule, DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    MailService, 
    // JwtStrategy,  
    JwtAuthGuard
  ],
  exports: [MailService, JwtModule],
})
export class AuthModule {}


