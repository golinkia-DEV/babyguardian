import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PairingConfirmDto {
  @ApiProperty()
  @IsString()
  @Length(4, 64)
  code: string;
}
