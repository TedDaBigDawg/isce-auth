import { ConflictException, HttpException, Injectable, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import *as jwt from "jsonwebtoken";
import * as uuid from 'uuid';
import { User, UserType } from '@prisma/client';
import { Response } from 'express';


interface SignupParams {
    name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
}

interface SigninParams {
    email: string;
    password: string;
    userType?: "ADMIN"|"USER"
}

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService) {}
    async signup({email, password, name, address, phone}: SignupParams, userType: UserType) {
        // signup logic

        const id = uuid.v4(); // Generate a unique ID

        const userExist = await this.prismaService.user.findUnique({
            where: {
                email
            },
        });
        if (userExist) {
            throw new ConflictException
        }

        const hashpassword = await bcrypt.hash(password, 10) 

        const user = await this.prismaService.user.create({
            data: {
                id: id,
                email,
                name,
                phone,
                address, 
                password: hashpassword,
                userType: userType,
            },
        });

        return this.generateJWT(user, password);

    }

    async signin(email: string, password: string, userType: string, res: Response) {
        // signin logic
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            },
        });

        if (!user) {
            throw new HttpException("Invalid Credentails", 400);
        }
        if (user.userType !== userType){
            throw new HttpException(`You are an ${user.userType} you can not log in as an ${userType}`, 401);
        }

        const hashpassword = user.password;
        
        const isValidPassword = await bcrypt.compare(password, hashpassword) // Comparing password

        if (!isValidPassword) {
            throw new HttpException("Invalid Credentails", 400);
        }

        const token = this.generateJWT(user, password);
        
        return res.status(201).send({
            success: "true",
            message: "Successfully Signed in",
            token,
          });
    }

    private generateJWT(user: User, password: string) {
        return jwt.sign({
            user,
            password,
        },
        process.env.JSON_TOKEN_KEY,
        {
            expiresIn: 3600000
        });
    }

    generateProductKey(email: string, userType: UserType) {
        const productKey = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`
        return bcrypt.hash(productKey, 10);
    }

}
