import { PrismaService } from '@app/common';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url, headers, body } = req;

    await this.prisma.logs.create({
      data: {
        method,
        url,
        headers: JSON.stringify(headers),
        body: JSON.stringify(body),
      },
    });

    next();
  }
}
