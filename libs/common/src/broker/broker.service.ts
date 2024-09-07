import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class BrokerService {
  constructor(private readonly config: ConfigService) {}
  getRmqOptions(queue: string): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        urls: [this.config.get('BROKER_URL')],
        noAck: false,
        queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}
