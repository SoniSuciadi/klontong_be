import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealt(): string {
    return 'Sehat Brodiiii';
  }
}
