import {Injectable, Scope} from '@nestjs/common';
import {UserService} from './user.service';
import {ClientService} from './client.service';

@Injectable({scope: Scope.REQUEST})
export class UserValidatorService {

  constructor(
    private readonly memberService: UserService,
    private readonly clientService: ClientService,
  ) {
  }

}
