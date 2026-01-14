import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/users/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const routeRoles = this.reflector.getAllAndOverride<Role[]>(
      'roles', [
        context.getHandler(),
        context.getClass(),
      ]
    )

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.roles) throw new ForbiddenException('Usuario no auntenticado');
    const userRoles = user.roles;

    const hasRole = () => routeRoles.some((role) => userRoles.includes(role));

    const valid = hasRole();
    if (!valid) throw new ForbiddenException('No tiene permisos para acceder a esta ruta');

    
    return true;
  }
}
