import {CommandHandler, EventBus, ICommandHandler} from '@nestjs/cqrs';
import {AccountRepository} from '../../../abstract/repository/account.repository';
import {CreateAccountCommand} from '../create-account.command';
import {Account} from '../../../domain/entities/account';
import {AccountCreatedEvent} from '../../events/account-created.event';
import {CreateAccountDto} from '../../../domain/dto/create-account.dto';
import * as bcrypt from 'bcrypt';
import {ConfigService} from '@nestjs/config';
import {BadRequestException} from '@nestjs/common';
import {Err, Ok, Result} from 'ts-results';

@CommandHandler(CreateAccountCommand)
export class CreateAccountCommandHandler implements ICommandHandler<CreateAccountCommand> {

  constructor(
    private readonly configService: ConfigService,
    private readonly eventBus: EventBus,
    private readonly accountRepository: AccountRepository,
  ) {
  }

  async execute(command: CreateAccountCommand): Promise<Result<number, Error>> {
    const accountExist = await this.accountRepository.findByEmail(command.email);
    if (accountExist) {
      return Err(new BadRequestException('User with this email already exist'));
    }

    const createAccountDto = new CreateAccountDto();
    createAccountDto.email = command.email;
    const saltOrRounds = Number(this.configService.get('SALT_ROUNDS'));
    createAccountDto.password = await bcrypt.hash(command.password, saltOrRounds);
    createAccountDto.firstName = command.firstName;
    createAccountDto.lastName = command.lastName;
    createAccountDto.isActive = true;

    const account = Account.create(createAccountDto);

    // Here goes logic for saving to Db
    try {
      const newAccount = await this.accountRepository.save(account);
      // Create event that acc was created
      this.eventBus.publish(new AccountCreatedEvent(newAccount));

      // return id of newly created acc
      return Ok(newAccount.getId().value);
    } catch (e: Error) {
      return Err(e);
    }
  }
}
