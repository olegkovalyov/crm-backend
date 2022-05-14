import {Injectable} from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class RandomStringService {
  constructor() {
  }

  async generateId(): Promise<string> {
    return uuidv4();
  }
}
