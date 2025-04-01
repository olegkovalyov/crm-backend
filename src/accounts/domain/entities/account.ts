import {AggregateRoot} from '@nestjs/cqrs';
import {Name} from '../value-objects/name';
import {Email} from '../value-objects/email';
import {CreateAccountDto} from '../dto/create-account.dto';
import {Password} from '../value-objects/password';
import {Id} from '../value-objects/id';

export class Account extends AggregateRoot {
  private readonly id: Id;
  private name: Name;
  private email: Email;
  private password: Password;

  private active: boolean;

  private constructor(input: CreateAccountDto) {
    super();
    this.id = new Id(input.id);
    this.active = input.isActive;

    this.name = new Name(input.firstName, input.lastName);
    this.email = new Email(input.email);
    this.password = new Password(input.password);
    return this;
  }

  public getName(): Name {
    return this.name;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getPassword(): Password {
    return this.password;
  }

  public isActive(): boolean {
    return this.active;
  }

  public setActive(isActive: boolean): Account {
    this.active = isActive;
    return this;
  }

  public getId(): Id {
    return this.id;
  }

  public static create(input: CreateAccountDto): Account {
    return new Account(input);
  }
}
