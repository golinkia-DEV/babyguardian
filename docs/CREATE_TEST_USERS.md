# Creating Test Users in BabyGuardian Backend

## Test Users Available

The following test users are pre-configured in the seed script:

| Email | Password | Full Name |
|-------|----------|-----------|
| admin@babyguardian.local | Admin123! | Admin User |
| parent1@babyguardian.local | Parent123! | Parent One |
| parent2@babyguardian.local | Parent123! | Parent Two |
| guardian@babyguardian.local | Guardian123! | Guardian User |

---

## Method 1: Using the Seed Script (Recommended)

### On Local Development

```bash
cd apps/backend

# Install dependencies (if not already done)
npm install

# Run migrations first (if not already done)
npm run migration:run

# Create test users
npx ts-node src/scripts/seed-test-users.ts
```

### On Remote Server (Docker Container)

#### Option A: SSH into the server and execute

```bash
# SSH into the VPS
ssh root@23.95.140.206

# Enter the Docker container
docker exec -it babyguardian-backend bash

# Navigate to app and run seed
cd /app
npx ts-node src/scripts/seed-test-users.ts
```

#### Option B: Execute directly from your machine

```bash
# Run the script inside the container without entering it
docker -H ssh://root@23.95.140.206 \
  exec babyguardian-backend \
  npx ts-node src/scripts/seed-test-users.ts
```

#### Option C: Docker Compose (if using docker-compose)

```bash
# From your local machine or VPS
docker-compose -H ssh://root@23.95.140.206 \
  exec backend \
  npx ts-node src/scripts/seed-test-users.ts
```

---

## Method 2: Using the API (Register via HTTP)

### Create a User via REST API

```bash
# Using curl
curl -X POST https://23.95.140.206:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword123!",
    "fullName": "Test User"
  }'
```

### Response

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "testuser@example.com",
    "fullName": "Test User",
    "avatarUrl": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzE3OTQyNjQyLCJleHAiOjE3MTg1NDc0NDJ9.xxxx"
}
```

---

## Method 3: Direct Database Insert

If you have database access, you can insert users directly:

### Using psql (PostgreSQL)

```bash
# Connect to the database
psql postgresql://babyguardian:password@23.95.140.206:5432/babyguardian_prod

# Insert a new user (password hash must be bcrypt)
INSERT INTO "user" (id, email, "passwordHash", "fullName", "createdAt", "updatedAt") 
VALUES (
  gen_random_uuid(),
  'testuser@example.com',
  '$2b$12$...',  -- bcrypt hash of password
  'Test User',
  NOW(),
  NOW()
);
```

### Generate a bcrypt hash

You can use Node.js to generate the hash:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('MyPassword123!', 12).then(h => console.log(h))"
```

Or use an online bcrypt generator (for testing only): https://bcrypt.online/

---

## Verify Users Were Created

### Check via API

```bash
# Try to login with a created user
curl -X POST https://23.95.140.206:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@babyguardian.local",
    "password": "Admin123!"
  }'
```

### Check in Database

```bash
# If you have DB access
psql postgresql://babyguardian:password@localhost:5432/babyguardian_dev

SELECT id, email, "fullName", "createdAt" FROM "user" 
WHERE email LIKE '%@babyguardian.local';
```

---

## Script Details

The seed script (`apps/backend/src/scripts/seed-test-users.ts`) does the following:

1. Connects to the database using TypeORM configuration
2. Checks if test users already exist
3. Hashes passwords using bcrypt (12 salt rounds)
4. Inserts users into the database
5. Prints created users with their credentials

### What the script does NOT do:

- Delete existing users (unless they have the test email domain)
- Modify existing test users
- Create duplicate users (checks for existing emails)

---

## Password Requirements

Test user passwords follow security best practices:

- **Minimum length**: 8 characters
- **Complexity**: Numbers, uppercase, lowercase, special characters
- **Example**: `Admin123!`

---

## Security Considerations

### For Development

- These test users should only be created in development environments
- Passwords are visible in this documentation (safe for local dev only)
- Test email domain: `@babyguardian.local` makes them easily identifiable

### For Production

- Do NOT use these test users in production
- Use strong, unique passwords
- Implement proper user management
- Consider using environment variables for sensitive credentials

---

## Troubleshooting

### Script fails with "Database connection error"

**Check**:
- Database is running and accessible
- `DATABASE_URL` environment variable is set correctly
- User has CREATE/INSERT permissions

### "User already exists" message

- The script checks for existing users and skips them
- To recreate, delete the user manually from the database first

### "Cannot find module '@nestjs/core'"

- Dependencies might not be installed
- Run `npm install` in the backend directory first

### "Error: ENOENT: no such file or directory"

- Script file not found or incorrect path
- Verify script location: `apps/backend/src/scripts/seed-test-users.ts`

---

## Environment Variables

The script uses the following from `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/babyguardian_dev
```

Make sure your `.env` file has a valid database connection.

---

## Helpful Commands

```bash
# Check if backend container is running
docker ps | grep babyguardian

# View backend container logs
docker logs babyguardian-backend

# Check database connection from container
docker exec babyguardian-backend psql $DATABASE_URL -c "SELECT 1"

# Count users in database
docker exec babyguardian-backend \
  psql $DATABASE_URL -c "SELECT COUNT(*) FROM \"user\""
```

---

## Next Steps

After creating test users:

1. **Mobile App**: Use credentials to login to the mobile app
2. **API Testing**: Use tokens for API testing and development
3. **Feature Development**: Test new features with these users
4. **Delete Test Data**: Clean up before production deployment
