import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { envs } from 'src/config/envs';
import { Role } from 'src/users/roles.enum';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();

    const authHeaders = request.headers['authorization'];
    if (!authHeaders) throw new UnauthorizedException('No se a enviado token');

    const [type, token] = authHeaders.split(' ');
    if (type !== 'Bearer' || !token) throw new UnauthorizedException('No se a enviado token');

    try {
      const paylod = this.jwtService.verify(token, {
        secret: envs.JWT_SECRET,
      });

      switch(paylod.role) {
        case Role.Administrator:
          paylod.roles = [Role.Administrator, Role.Supervisor, Role.Engineer];
        break;
        case Role.Supervisor:
          paylod.roles = [Role.Supervisor, Role.Engineer, Role.Laboratorist];
        break;
        case Role.Engineer:
          paylod.roles = [Role.Engineer, Role.Laboratorist];
        break;
        default:
        paylod.roles = [paylod.role];
    }

      request.user = paylod;

    }catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }
      throw new UnauthorizedException('Token no valido');
    };
    
    return true;
  }
}
