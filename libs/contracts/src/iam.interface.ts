export abstract class IAMService {
  abstract validateUser(username: string, password: string): Promise<any>;
}

export abstract class HashingService {
  abstract hash(data: string): Promise<string>

  abstract compare(data: string, encrypted: string): Promise<boolean>
}
