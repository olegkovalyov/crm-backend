import {AuthEntity} from '../entities/auth.entity';
import {Auth} from '../../../domain/entities/auth.entity';

export class AuthMapper {
  static toDomain(authEntity: AuthEntity): Auth {
    return Auth.create(
      authEntity.id,
      authEntity.accountId,
      authEntity.email,
      authEntity.firstName,
      authEntity.lastName,
      authEntity.isActive,
      authEntity.accessToken,
      authEntity.refreshToken,
    );
  }

  static toPersistence(auth: Auth): AuthEntity {
    const authEntity = new AuthEntity();
    authEntity.id = auth.getId();
    authEntity.accountId = auth.getAccountId();
    authEntity.email = auth.getEmail();
    authEntity.firstName = auth.getFirstName();
    authEntity.lastName = auth.getLastName();
    authEntity.isActive = auth.isAccountActive();
    authEntity.accessToken = auth.getAccessToken();
    authEntity.refreshToken = auth.getRefreshToken();
    return authEntity;
  }
}
