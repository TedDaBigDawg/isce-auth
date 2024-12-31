import { Body, Controller, Get, Param, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, ResetPasswordDto, SendResetTokenDto } from './dto/auth.dto';
import { LoginDto } from './dto/auth.dto'; 
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.'})
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  signup(
    @Body(ValidationPipe) dto: RegisterDto) {
    return this.authService.signup(dto);
  }




  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiResponse({ status: 201, description: 'User signed in successfully.'})
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  signin(
    @Body() dto: LoginDto, 
    @Req() req: Request, 
    @Res() res: Response) {
    return this.authService.signin(dto, req, res);
  }

  @Post('signin-events')
  @ApiOperation({ summary: 'Sign in a user for events' })
  @ApiResponse({ status: 201, description: 'User signed in successfully.'})
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  signinEvents(
    @Body() dto: LoginDto, 
    @Req() req: Request, 
    @Res() res: Response) {
    return this.authService.signinEvents(dto, req, res);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({ status: 201, description: 'In progress.'})
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('send-reset-token')
  @ApiOperation({ summary: 'Send reset token to reset the password' })
  @ApiResponse({ status: 201, description: 'Reset token sent successfully.'})
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  sendResetToken(
    @Body() sendResetTokenDto: SendResetTokenDto) {
    return this.authService.sendResetToken(sendResetTokenDto.email);
  }

  @Get('signout')
  @ApiOperation({ summary: 'Sign out current user' })
  @ApiResponse({ 
    status: 201, 
    description: 'Successfully cleared token from cookies and signed user out.'})
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  signout(
    @Req() req: Request, 
    @Res() res: Response) {
    return this.authService.singout(req, res);
  }
}
