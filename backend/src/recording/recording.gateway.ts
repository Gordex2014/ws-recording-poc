import { createWriteStream, WriteStream } from 'fs';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { RecordingService } from './recording.service';

interface ClientMetadata {
  name: string;
}

interface ClientBlob extends ClientMetadata {
  blob: Buffer;
}

@WebSocketGateway({ cors: true })
export class RecordingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  #logger = new Logger(RecordingGateway.name);
  #baseFilePath = join(process.cwd(), 'recordings');
  #clientsStreams = new Map<string, WriteStream>();

  constructor(private readonly recordingService: RecordingService) {}

  handleConnection(client: Socket) {
    this.#logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.#logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('startRecording')
  onStart(client: Socket, payload: ClientMetadata) {
    const filePath = join(this.#baseFilePath, payload.name + '.webm');

    this.#clientsStreams.set(payload.name, createWriteStream(filePath));
    this.#logger.log('Starting recording');
  }

  @SubscribeMessage('blob')
  onBlobs(client: Socket, payload: ClientBlob) {
    const stream = this.#clientsStreams.get(payload.name);
    this.#logger.log('Received blob');
    stream.write(Buffer.from(new Uint8Array(payload.blob)));
  }

  @SubscribeMessage('stopRecording')
  onStop(client: Socket, payload: ClientMetadata) {
    this.#clientsStreams.delete(payload.name);
    this.#logger.log('Stopping recording');
  }
}
