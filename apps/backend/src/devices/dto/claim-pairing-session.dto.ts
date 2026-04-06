import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ClaimPairingSessionDto {
  @ApiProperty({
    description: 'Pairing code (8 characters, case-insensitive)',
    example: 'K7M4P2Q9',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(8, 8)
  code?: string;

  @ApiProperty({
    description: 'Internal pairing token UUID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  @IsOptional()
  @IsString()
  pairingToken?: string;
}
