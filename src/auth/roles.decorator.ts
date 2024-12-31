import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';  // Adjust the path to where your Role enum is defined

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
