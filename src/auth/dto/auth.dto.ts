import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'User name', example: 'Elon Musk' })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({ description: 'User phone number', example: '09067584674' })
  @IsNotEmpty()
  @MinLength(10)
  @IsString()
  phone: string;

  @ApiProperty({ description: 'User email', example: 'elonmusk@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User date of birth', example: 'mm/dd/yyyy' })
  @IsNotEmpty()
  dob: Date;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}




export class LoginDto {
  
    @ApiProperty({ description: 'User name', example: 'Elon Musk' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}


export class ResetPasswordDto {
  @ApiProperty({ description: 'Code to reset password', example: 'gacrow93q7r846t734o8ey817q6etgedfkdh' })
  @IsNotEmpty()
  @IsString()
  resetCode: string;

  @ApiProperty({ description: 'New password', example: 'password456' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class SendResetTokenDto {
  @ApiProperty({ description: 'User email', example: 'elonmusk@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}