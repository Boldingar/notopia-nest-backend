import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // For accessing metadata
import { Observable } from 'rxjs';

// RolesGuard Class
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Retrieve the required roles from the @Roles decorator
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // If no roles are required, grant access
    }
    // Extract the user object from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user exists and has the required roles
    return user && user.flag && this.matchRoles(roles, [user.flag]);
  }

  matchRoles(requiredRoles: string[], userRoles: string[]): boolean {
    // Check if the user has at least one required role
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
