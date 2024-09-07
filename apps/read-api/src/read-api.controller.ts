import { Controller, Get } from '@nestjs/common';
import { ReadApiService } from './read-api.service';

@Controller()
export class ReadApiController {
  constructor(private readonly readApiService: ReadApiService) {}

  @Get()
  getHello(): string {
    return this.readApiService.getHello();
  }
}
