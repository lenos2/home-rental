import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { registerSchema } from '@/lib/validations';
import { signToken, generateRandomToken } from '@/lib/jwt';
import { sendVerificationEmail } from '@/lib/email';
import { generateSlug } from '@/lib/utils';
import { DEFAULT_ROLES } from '@/lib/permissions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const slug = generateSlug(validatedData.companyName);
    let uniqueSlug = slug;
    let counter = 1;

    while (await prisma.tenant.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const starterPlan = await prisma.subscriptionPlan.findFirst({
      where: { tier: 'starter' },
    });

    if (!starterPlan) {
      return NextResponse.json(
        { error: 'Subscription plans not configured' },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const emailVerificationToken = generateRandomToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const tenant = await prisma.tenant.create({
      data: {
        name: validatedData.companyName,
        slug: uniqueSlug,
        email: validatedData.email,
        phone: validatedData.phone,
        status: 'active',
        emailVerified: false,
      },
    });

    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const subscription = await prisma.subscription.create({
      data: {
        tenantId: tenant.id,
        planId: starterPlan.id,
        status: 'trialing',
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEndsAt,
        trialEndsAt,
      },
    });

    const role = await prisma.role.create({
      data: {
        tenantId: tenant.id,
        name: 'Account Owner',
        permissions: DEFAULT_ROLES['Account Owner'],
      },
    });

    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        userType: 'staff',
        roleId: role.id,
        emailVerified: false,
        emailVerificationToken,
        emailVerificationExpires,
        status: 'active',
      },
    });

    await sendVerificationEmail(
      user.email,
      emailVerificationToken,
      tenant.name,
      tenant.brandColorMain || undefined
    );

    const token = await signToken({
      userId: user.id,
      tenantId: tenant.id,
      email: user.email,
      userType: user.userType,
      roleId: role.id,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          tenantId: tenant.id,
          tenantSlug: tenant.slug,
        },
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
