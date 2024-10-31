import { ApiProperty } from "@nestjs/swagger";
import { UserType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class SignupDto {
    @ApiProperty({
        description: 'User name',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'User Email',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User Phone',
    })
    @MinLength(10)
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        description: 'User Address',
    })
    @IsString()
    address: string;

    @ApiProperty({
        description: 'User Password',
    })
    @IsString()
    @MinLength(5)
    password: string;

    @ApiProperty({
        description: 'Type of User',
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    productKey?: string;
}

export class SigninDto {
    @ApiProperty({
        description: 'User Email',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User Password',
    })
    @IsString()
    password: string;
}

export class GenerateProductKeyDto {
    @ApiProperty({
        description: 'User Email',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Type of User',
    })
    @IsEnum(UserType)
    userType: UserType
}