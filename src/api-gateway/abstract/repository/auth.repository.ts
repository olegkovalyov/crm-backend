import {Auth} from '../../domain/entities/auth.entity';

export abstract class AuthRepository {
  abstract findAll(): Promise<Auth[]>

  abstract findByAccountId(accountId: number): Promise<Auth | null>

  abstract save(auth: Auth): Promise<Auth>
}
