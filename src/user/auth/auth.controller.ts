import { Body, Controller, Param, ParseEnumPipe, Post, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('User')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('/signup/:userType')
    @ApiCreatedResponse({
        description: 'User created successfully'
      })
      @ApiBadRequestResponse({
        description: 'Invalid request',
      })
    async signup(
        @Body() body: SignupDto, 
        @Param('userType', new ParseEnumPipe(UserType)) userType: UserType
    ) {
    
        if (userType !== UserType.USER) {
            if (!body.productKey) {
                throw new UnauthorizedException()
            }

            const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`

            const isValidProductKey = await bcrypt.compare(
                validProductKey, 
                body.productKey,           
            );

            if (!isValidProductKey) {
                throw new UnauthorizedException();
            }
        }

        return this.authService.signup(body, userType);
    }

    @Post('/signin/:userType')
    @ApiCreatedResponse({
        description: 'Signin successfully',
      })
      @ApiBadRequestResponse({
        description: 'Invalid request',
      })
    signin(
        @Param('userType') userType: 'ADMIN'|'USER',
        @Body() body: SigninDto, @Res() res) {
            const {email, password} = body
        return this.authService.signin(email, password, userType, res)
    }

    @Post('key')
    @ApiCreatedResponse({
        description: 'User Product key created successfully',
      })
      @ApiBadRequestResponse({
        description: 'Invalid request',
      })
    generateProductKey(
        @Body() {email, userType}: GenerateProductKeyDto) {
        return this.authService.generateProductKey(email, userType);
    }
}
