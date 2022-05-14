import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CryptoService {
  constructor() {
  }

  async generateSalt(): Promise<string> {
    return bcrypt.genSalt();
  }

  async generateHash(value: string, salt: string | number): Promise<string> {
    return bcrypt.hash(value, salt);
  }
}
