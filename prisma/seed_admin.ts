import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial admin account...');

  const passwordHash = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@consultancy.com' },
    update: {},
    create: {
      email: 'admin@consultancy.com',
      name: 'System Admin',
      passwordHash: passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Admin account created:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
