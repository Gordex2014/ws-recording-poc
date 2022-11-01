import { Module } from '@nestjs/common';
import { RecordingService } from './recording.service';
import { RecordingGateway } from './recording.gateway';

@Module({
  providers: [RecordingGateway, RecordingService],
})
export class RecordingModule {}
