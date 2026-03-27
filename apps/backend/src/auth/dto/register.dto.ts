import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'papa@babyguardian.cl' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'mi_password_seguro' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Felipe García' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;
}
