import {Injectable} from '@nestjs/common';

@Injectable()
export class EventValidatorService {

  async validateStartDate(startDate: Date, endDate: Date): Promise<boolean> {
    return new Date(startDate).getTime() < endDate.getTime();
  }

  async validateEndDate(startDate: Date, endDate: Date): Promise<boolean> {
    return new Date(startDate).getTime() > endDate.getTime();
  }
}
