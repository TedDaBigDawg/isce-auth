import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from './roles.decorator';  // Import the custom decorator
  import { Role } from '@prisma/client';  // Adjust the path to where your Role enum is defined
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      console.log('Request:', request);
      console.log('User in request:', request.user);
      // Extract the roles required for the handler (route) from metadata
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      // If no roles are defined for the route, allow access
      if (!requiredRoles) {
        return true;
      }
  
      // Get the user from the request object (assumes user is added by AuthGuard)
      const { user } = context.switchToHttp().getRequest();
      console.log(user);
  
      // If user doesn't exist or role is not in the required roles, deny access
      if (!user || !requiredRoles.includes(user.role)) {
        throw new ForbiddenException('You do not have access to this resource');
      }
  
      // Allow access if the role matches
      return true;
    }
  }
  