import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { typeOrmConfig } from '../config/typeorm.config';

interface TestUser {
  email: string;
  password: string;
  fullName: string;
}

const TEST_USERS: TestUser[] = [
  {
    email: 'admin@babyguardian.local',
    password: 'Admin123!',
    fullName: 'Admin User',
  },
  {
    email: 'parent1@babyguardian.local',
    password: 'Parent123!',
    fullName: 'Parent One',
  },
  {
    email: 'parent2@babyguardian.local',
    password: 'Parent123!',
    fullName: 'Parent Two',
  },
  {
    email: 'guardian@babyguardian.local',
    password: 'Guardian123!',
    fullName: 'Guardian User',
  },
];

async function seedUsers() {
  const dataSource = new DataSource(typeOrmConfig as any);

  try {
    await dataSource.initialize();
    console.log('✓ Database connected');

    const userRepository = dataSource.getRepository(User);

    // Clear existing test users
    await userRepository.delete({ email: dataSource.manager.query(`
      SELECT email FROM "user" WHERE email LIKE '%@babyguardian.local'
    `) });
    console.log('✓ Cleared existing test users');

    // Create new test users
    const createdUsers = [];
    for (const testUser of TEST_USERS) {
      const existing = await userRepository.findOne({ where: { email: testUser.email } });
      if (existing) {
        console.log(`⊘ User ${testUser.email} already exists, skipping`);
        continue;
      }

      const passwordHash = await bcrypt.hash(testUser.password, 12);
      const user = userRepository.create({
        email: testUser.email,
        passwordHash,
        fullName: testUser.fullName,
      });
      await userRepository.save(user);
      createdUsers.push(testUser);
      console.log(`✓ Created user: ${testUser.email}`);
    }

    console.log('\n📋 Test Users Created:');
    console.log('─'.repeat(60));
    createdUsers.forEach(user => {
      console.log(`Email:    ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Name:     ${user.fullName}`);
      console.log('─'.repeat(60));
    });

    console.log('\n✓ Seed completed successfully');
  } catch (error) {
    console.error('✗ Error seeding users:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

seedUsers();
