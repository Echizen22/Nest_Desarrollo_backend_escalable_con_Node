import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService
  ) {}

  handleConnection( client: Socket ) {
    const token = client.handshake.headers.authentication as string;
    console.log({ token });
    // console.log('Clinete conectado:', client.id );
    this.messagesWsService.registerClient( client );

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients() );

  }
  
  handleDisconnect( client: Socket ) {
    // console.log('Cliente desconectado', client.id );
    this.messagesWsService.removeClient( client.id );

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients() );
  }

  
  @SubscribeMessage('message-from-client')
  onMessageFromClient( client: Socket, payload: NewMessageDto ) { 
    
    //! Emite únicamente al cliente.
    // client.emit('message-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no-message!!'
    // });

    //! Emitir a todos MENOS, al cliente que envio el mensaje
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no-message!!'
    // });

    //! Emitir a todos incluido el que envio el mensaje.
    this.wss.emit('message-from-server', {
      fullName: 'Soy Yo!',
      message: payload.message || 'no-message!!'
    })

  }

}
