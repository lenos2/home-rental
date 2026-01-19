import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL || 'admin@propertymanager.com';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123456';

  console.log('Creating super admin tenant and user...');

  // Create super admin tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'superadmin' },
    update: {},
    create: {
      name: 'Super Admin',
      slug: 'superadmin',
      email: email,
      status: 'active',
      emailVerified: true,
    },
  });

  console.log(`✓ Created/Found tenant: ${tenant.name}`);

  // Get starter plan for subscription
  const starterPlan = await prisma.subscriptionPlan.findFirst({
    where: { tier: 'starter' },
  });

  if (!starterPlan) {
    throw new Error('Starter plan not found. Please run seed-plans.ts first.');
  }

  // Create subscription for super admin
  await prisma.subscription.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      planId: starterPlan.id,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      maxPropertiesOverride: -1,
      maxUsersOverride: -1,
      maxOfficesOverride: -1,
    },
  });

  console.log('✓ Created subscription');

  // Create super admin role
  const role = await prisma.role.upsert({
    where: {
      tenantId_name: {
        tenantId: tenant.id,
        name: 'Super Admin',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Super Admin',
      permissions: {
        properties: ['view', 'create', 'edit', 'delete', 'manage'],
        leases: ['view', 'create', 'edit', 'delete', 'manage'],
        tenants: ['view', 'create', 'edit', 'delete', 'manage'],
        maintenance: ['view', 'create', 'edit', 'delete', 'manage'],
        payments: ['view', 'create', 'edit', 'delete', 'manage'],
        users: ['view', 'create', 'edit', 'delete', 'manage'],
        roles: ['view', 'create', 'edit', 'delete', 'manage'],
        settings: ['view', 'create', 'edit', 'delete', 'manage'],
        billing: ['view', 'create', 'edit', 'delete', 'manage'],
        offices: ['view', 'create', 'edit', 'delete', 'manage'],
        reports: ['view', 'create', 'edit', 'delete', 'manage'],
      },
    },
  });

  console.log(`✓ Created role: ${role.name}`);

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create super admin user
  const user = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: email,
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: email,
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      userType: 'staff',
      roleId: role.id,
      emailVerified: true,
      status: 'active',
    },
  });

  console.log(`✓ Created user: ${user.email}`);
  console.log('\nSuper Admin Credentials:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('\n⚠️  Please change the password after first login!');
}

main()
  .catch((e) => {
    console.error('Error creating super admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
