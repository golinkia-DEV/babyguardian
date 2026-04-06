import { ApiProperty } from '@nestjs/swagger';

export class PairingSessionResponseDto {
  @ApiProperty({
    description: 'Pairing session ID',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  id: string;

  @ApiProperty({
    description: '8-character pairing code (user-friendly)',
    example: 'K7M4P2Q9',
  })
  code: string;

  @ApiProperty({
    description: 'QR payload containing pairingToken for deep-linking',
    example: 'babyguardian://pair?token=f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  qrData: string;

  @ApiProperty({
    description: 'Expiration time in ISO format',
    example: '2024-04-06T12:05:30Z',
  })
  expiresAt: string;

  @ApiProperty({
    description: 'Session status',
    enum: ['pending', 'claimed', 'expired', 'cancelled'],
    example: 'pending',
  })
  status: 'pending' | 'claimed' | 'expired' | 'cancelled';
}

export class PairingStatusResponseDto {
  @ApiProperty({
    description: 'Session status',
    enum: ['pending', 'claimed', 'expired', 'cancelled'],
    example: 'pending',
  })
  status: 'pending' | 'claimed' | 'expired' | 'cancelled';

  @ApiProperty({
    description: 'User who claimed this session (if claimed)',
    example: 'user@example.com',
    required: false,
  })
  claimedBy?: string;

  @ApiProperty({
    description: 'Time when session was claimed',
    example: '2024-04-06T12:02:30Z',
    required: false,
  })
  claimedAt?: string;
}

export class ClaimResponseDto {
  @ApiProperty({
    description: 'Whether claim was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Home ID being paired',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    required: false,
  })
  homeId?: string;

  @ApiProperty({
    description: 'Error reason if claim failed',
    example: 'Pairing code expired',
    required: false,
  })
  reason?: string;
}
