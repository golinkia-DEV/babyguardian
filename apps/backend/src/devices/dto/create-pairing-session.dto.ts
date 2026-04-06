import { IsUUID, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePairingSessionDto {
  @ApiProperty({
    description: 'Home ID where pairing will be linked',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsUUID()
  homeId: string;

  @ApiProperty({
    description: 'Optional hub device ID for multi-hub support',
    required: false,
    example: 'hub-001',
  })
  @IsOptional()
  @IsString()
  hubDeviceId?: string;
}
