import { Injectable } from '@nestjs/common';

@Injectable()
export class ReadApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
