import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class BroadcastGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;

  handleConnection(client: Socket) {
    client.emit('connection', 'Successfully connected to the server');
  }

  handleDisconnect(client: Socket) {
    client.emit('disconnect', 'Successfully disconnected from the server');
  }

  broadcastEvent(eventName: string, data: any) {
    this.server.emit(eventName, data);
  }
}
