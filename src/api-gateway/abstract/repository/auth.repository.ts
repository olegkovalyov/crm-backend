import {Auth} from '../../domain/entities/auth';

export abstract class AuthRepository {
  abstract findAll(): Promise<Auth[]>

  abstract findById(id: number): Promise<Auth | null>

  abstract save(auth: Auth): Promise<Auth>
}
