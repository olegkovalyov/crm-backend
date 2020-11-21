import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { MemberAccessTokenPayloadInterface, MemberRole } from '../interfaces/member.interface';

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
    const decodedToken = this.jwtService.decode(token) as MemberAccessTokenPayloadInterface;
    return decodedToken.roles.includes(MemberRole.ADMIN)
      || decodedToken.roles.includes(MemberRole.MANIFEST);
  }
}

