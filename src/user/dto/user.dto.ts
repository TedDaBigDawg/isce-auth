import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminUserDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;


  @ApiProperty({ description: 'User password', minLength: 6, example: 'password123' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;


  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullname: string;


  @ApiProperty({ description: 'User phone number', example: '09067584674' })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  phone: string;


  @ApiProperty({ description: 'User date of birth', example: 'mm/dd/yyyy' })
  @IsNotEmpty()
  dob: Date;
}



export class UpdateUserDto {
    @ApiProperty({ description: 'User email address', example: 'user@example.com' })
    @IsEmail()
    @IsOptional()
    email?: string;
  
    @ApiProperty({ description: 'Full name of the user', example: 'Elon Musk' })
    @IsString()
    @IsOptional()
    fullname?: string;

    @ApiProperty({ description: 'User phone number', example: '09067584674' })
    @IsOptional()
    @IsString()
    @MinLength(10)
    phone?: string;

    @ApiProperty({ description: 'User date of birth', example: 'mm/dd/yyyy' })
    @IsOptional()
    dob?: Date;
}
