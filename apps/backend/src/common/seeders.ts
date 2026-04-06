import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

export async function seedDatabase(dataSource: DataSource) {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Crear usuario admin de prueba si no existe
    const adminExists = await queryRunner.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@babyguardian.local'],
    );

    if (adminExists.length === 0) {
      const passwordHash = await bcrypt.hash('Admin@12345', 12);

      await queryRunner.query(
        `INSERT INTO users (id, email, password_hash, full_name, role, is_active)
         VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5)`,
        ['admin@babyguardian.local', passwordHash, 'Admin User', 'admin', true],
      );

      console.log('✓ Seeder: Usuario admin creado');
    }
  } catch (error) {
    console.error('Error en seeder:', error);
  } finally {
    await queryRunner.release();
  }
}
