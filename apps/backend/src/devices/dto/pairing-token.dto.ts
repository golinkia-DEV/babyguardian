import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PairingTokenDto {
  @ApiProperty()
  @IsUUID()
  homeId: string;
}
