export class CreateAccountDto {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}
