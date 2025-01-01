import {UserInfoEntity} from '../../../../core/infrasctucture/typeorm/entities/user-info.entity';
import {Auth} from '../../../domain/entities/auth';


export class UserInfoMapper {
  static toDomain(userInfoEntity: UserInfoEntity): Auth {
    return Auth.create(
      userInfoEntity.id,
      userInfoEntity.accountId,
      userInfoEntity.email,
      userInfoEntity.firstName,
      userInfoEntity.lastName,
      userInfoEntity.isActive,
      userInfoEntity.accessToken,
      userInfoEntity.refreshToken,
    );
  }

  static toPersistence(auth: Auth): UserInfoEntity {
    const userInfoEntity = new UserInfoEntity();
    userInfoEntity.id = auth.getId();
    userInfoEntity.accountId = auth.getAccountId();
    userInfoEntity.email = auth.getEmail();
    userInfoEntity.firstName = auth.getFirstName();
    userInfoEntity.lastName = auth.getLastName();
    userInfoEntity.isActive = auth.isAccountActive();
    userInfoEntity.accessToken = auth.getAccessToken();
    userInfoEntity.refreshToken = auth.getRefreshToken();
    return userInfoEntity;
  }
}
