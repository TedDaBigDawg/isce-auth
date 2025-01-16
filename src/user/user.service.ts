import { Injectable, BadRequestException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CreateAdminUserDto, UpdateUserDto } from './dto/user.dto';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { transformToUserDto } from 'src/auth/dto/auth.dto';


@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

    async createAdminUser(createAdminUserDto: CreateAdminUserDto) {
        const { email, password, fullname, phone, dob} = createAdminUserDto;

        try {

            const formattedEmail = email.toLowerCase();

            const existingUser = await this.databaseService.user.findUnique({
                where: { email: formattedEmail },
            });

            if (existingUser) {
                throw new BadRequestException('Email is already registered');
            }

            let formattedDob: string;
            let utcDob: Date;

            if (dob) {
              // If already a Date object, format it
              formattedDob = dob.toISOString().split('T')[0];
              // If dob is a string, parse it to a Date
              const parsedDob = new Date(dob);

              // if (isNaN(parsedDob.getTime())) {
              //   throw new Error('Invalid date format for dob');
              // }

              utcDob = new Date(Date.UTC(parsedDob.getFullYear(), parsedDob.getMonth(), parsedDob.getDate()));

              console.log('utcDob', utcDob);
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdminUser = await this.databaseService.user.create({
                data: {
                email: formattedEmail,
                password: hashedPassword,
                fullname,
                phone: phone,
                role: "ADMIN",
                dob: utcDob
                },
            });

            // Transform user to DTO for the response
            const userDto = transformToUserDto(newAdminUser);
            return {
              success: true,
                message: 'Admin User created successfully',
                data: userDto 
            };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to create admin  user, Internal server error', HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }




    async getAllUsers({ role, limit = 10, offset = 0 }: { role?: Role, limit?: number, offset?: number }) {
        try {
          const where = role ? { role } : { deletedAt: null };
    
          const users = await this.databaseService.user.findMany({
            where,
            take: limit,
            skip: offset,
          });
    
          if (users.length === 0 ) {
            throw new NotFoundException('User not found');
          }

          // Transform user to DTO for the response
          const userDto = transformToUserDto(users);

          return {
            success: true,
            message: "Fetched users successfully",
            data: userDto,
          }
        } catch (error) {
            throw new HttpException(error.message || 'Failed to fetch users, Internal server error', HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }

      
    async getUserById(id: string) {
        try {
            const user = await this.databaseService.user.findUnique({
              where: { id, deletedAt: null },
            });
      
            if (!user) {
              throw new NotFoundException(`User with ID ${id} not found`);
            }
      
            // Transform user to DTO for the response
            const userDto = transformToUserDto(user);
            return {
              success: true,
                message: "User fetched successfully",
                data: userDto,
            }
        } catch (error) {
            throw new HttpException(error.message || 'Failed to fetch user, Internal server error', HttpStatus.INTERNAL_SERVER_ERROR); 
        }
    }


    async updateUser(id: string, updateUserDto: UpdateUserDto) {
      try {

          const { dob, email, fullname, phone } = updateUserDto;
          let formattedDob: string;
          let utcDob: Date;
          let formattedEmail: string;

          
          const existingUser = await this.databaseService.user.findUnique({
            where: { id, deletedAt: null },
          });
    
          if (!existingUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
          }

          if (email) {
            formattedEmail = email.toLowerCase();
          }

          if(dob) {
            
              // If already a Date object, format it
              formattedDob = dob.toISOString().split('T')[0];
              // If dob is a string, parse it to a Date
              const parsedDob = new Date(dob);
  
              // if (isNaN(parsedDob.getTime())) {
              //   throw new Error('Invalid date format for dob');
              // }
  
              utcDob = new Date(Date.UTC(parsedDob.getFullYear(), parsedDob.getMonth(), parsedDob.getDate()));
  
              console.log('utcDob', utcDob);
            }
          
    
          const updatedUser = await this.databaseService.user.update({
            where: { id, deletedAt: null },
            data: { fullname: fullname, phone: phone, dob: utcDob, email: formattedEmail},
          });

          // Transform user to DTO for the response
         const userDto = transformToUserDto(updateUserDto);
  
          return {
            success: true,
            message: "User updated successfully",
            data: userDto,
        }
      } catch (error) {
        throw new HttpException(error.message || 'Failed to update user, Internal server error', HttpStatus.INTERNAL_SERVER_ERROR); 
      }
    }



    async softDeleteUser(id: string) {
      try {
          const user = await this.databaseService.user.findUnique({
            where: { id, deletedAt: null },
          });
    
          if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
          }
          const deletedUser = await this.databaseService.user.update({
            where: { id },
            data: { deletedAt: new Date() },
          });
  
          // Transform user to DTO for the response
          const userDto = transformToUserDto(deletedUser);
          return {
            success: true,
            message: "User updated successfully",
            data: userDto,
          }      
        } catch (error) {
        throw new HttpException(error.message || 'Failed to delete user, Internal server error', HttpStatus.INTERNAL_SERVER_ERROR); 
      }
    }



    async batchSoftDeleteUsers(userIds: string[]) {
      try {
          const users = await this.databaseService.user.findMany({
            where: { id: { in: userIds } },
          });
          if (users.length === 0) {
            throw new NotFoundException('No users found with the provided IDs');
          }

          const result = await this.databaseService.user.updateMany({
            where: { id: { in: userIds } },
            data: { deletedAt: new Date() },
          });

          // Transform user to DTO for the response
          const userDto = transformToUserDto(result);
          return {
            success: true,
            message: `${result.count} users soft deleted successfully.`,
            data: userDto,
          };
      } catch (error) {
        throw new HttpException(error.message || 'Failed to delete users, Internal server error', HttpStatus.INTERNAL_SERVER_ERROR); 
      }
    }




    async searchUsers(
      email?: string,
      fullname?: string,
      role?: Role,
      limit?: number,
      offset?: number
    ) {
      try {
          const filters: any = {
            deletedAt: null,
          };

          if (email) {
            filters.email = { contains: email, mode: 'insensitive' };
          }
          if (fullname) {
            filters.fullname = { contains: fullname, mode: 'insensitive' };
          }
          if (role) {
            filters.role = role;
          }
          const users = await this.databaseService.user.findMany({
            where: filters,
            take: limit || 10,
            skip: offset || 0,
          });

          // Transform user to DTO for the response
          const userDto = transformToUserDto(users);
          return {
            success: true,
            message: 'Users retrieved successfully',
            data: userDto,
          };
      } catch (error) {
        throw new HttpException(error.message || 'Failed to fetch users, Internal server error', HttpStatus.INTERNAL_SERVER_ERROR); 
      }
    }


    async getTotalUserCount() {
      try {
          const count = await this.databaseService.user.count({
            where: { deletedAt: null },
          });

          return {
            success: true,
            message: 'Total user count retrieved successfully',
            data: count,
          };
      } catch (error) {
        throw new HttpException(error.message || 'Failed to count users, Internal server error', HttpStatus.INTERNAL_SERVER_ERROR); 
      }
    }



    async getActiveUsers() {
      try {
          const activeUsers = await this.databaseService.user.findMany({
            where: { deletedAt: null },
          });

          // Transform user to DTO for the response
          const userDto = transformToUserDto(activeUsers);
          return {
            success: true,
            message: 'Active users retrieved successfully',
            data: userDto,
          };
      } catch (error) {
        throw new HttpException(error.message || 'Failed to get users, Internal server error', HttpStatus.INTERNAL_SERVER_ERROR); 
      }
    }
          
}






