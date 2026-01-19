import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding subscription plans...');

  const plans = [
    {
      name: 'Starter',
      tier: 'starter',
      description: 'Perfect for small property management companies',
      price: 49.00,
      currency: 'USD',
      maxProperties: 10,
      maxUsers: 3,
      maxOffices: 1,
      displayOrder: 1,
      features: [
        'Basic property management',
        'Tenant portal',
        'Payment tracking',
        'Email notifications',
        'Mobile responsive',
      ],
    },
    {
      name: 'Growth',
      tier: 'growth',
      description: 'For growing property management businesses',
      price: 149.00,
      currency: 'USD',
      maxProperties: 50,
      maxUsers: 10,
      maxOffices: 5,
      displayOrder: 2,
      features: [
        'All Starter features',
        'Custom branding',
        'Custom domain',
        'Maintenance tracking',
        'Advanced reporting',
        'Priority support',
        'Multi-office management',
      ],
    },
    {
      name: 'Enterprise',
      tier: 'enterprise',
      description: 'For large-scale property management operations',
      price: 399.00,
      currency: 'USD',
      maxProperties: -1,
      maxUsers: -1,
      maxOffices: -1,
      displayOrder: 3,
      features: [
        'All Growth features',
        'White-label',
        'API access',
        'Audit logs',
        'Dedicated account manager',
        'Unlimited properties',
        'Unlimited users',
        'Unlimited offices',
        'Custom integrations',
      ],
    },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { tier: plan.tier },
      update: plan,
      create: plan,
    });
    console.log(`✓ Created/Updated plan: ${plan.name}`);
  }

  console.log('Subscription plans seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding plans:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
