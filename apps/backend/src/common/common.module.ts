import { Global, Module, forwardRef } from '@nestjs/common';
import { FieldEncryptionService } from './field-encryption.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => AuthModule)],
  providers: [FieldEncryptionService],
  exports: [FieldEncryptionService, UsersModule, AuthModule],
})
export class CommonModule {}
