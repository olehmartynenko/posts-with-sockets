import { Injectable } from '@nestjs/common';

@Injectable()
export class WriteApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
