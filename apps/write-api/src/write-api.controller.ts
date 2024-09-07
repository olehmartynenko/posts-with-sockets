import { Controller, Get } from '@nestjs/common';
import { WriteApiService } from './write-api.service';

@Controller()
export class WriteApiController {
  constructor(private readonly writeApiService: WriteApiService) {}

  @Get()
  getHello(): string {
    return this.writeApiService.getHello();
  }
}
