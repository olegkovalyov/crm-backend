import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UserAccessTokenPayloadInterface, UserRole } from '../interfaces/user.interface';

@Injectable()
export class IsAdminOrManifestGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const token = ctx.getContext().req.header('authorization').slice(7);
    const decodedToken = this.jwtService.decode(token) as UserAccessTokenPayloadInterface;
    return decodedToken.role.includes(UserRole.ADMIN)
      || decodedToken.role.includes(UserRole.MANIFEST);
  }
}

