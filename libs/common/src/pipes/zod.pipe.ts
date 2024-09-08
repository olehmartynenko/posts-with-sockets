import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(
    private schemas: Partial<Record<ArgumentMetadata['type'], ZodSchema>>,
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const currentSchema = this.schemas[metadata.type];
    if (!currentSchema) {
      return value;
    }
    const parsedValue = currentSchema.safeParse(value);
    if (parsedValue.success) {
      return parsedValue.data;
    }
    throw new BadRequestException(parsedValue.error.errors);
  }
}
