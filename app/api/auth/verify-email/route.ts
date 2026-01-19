import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyEmailSchema } from '@/lib/validations';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = verifyEmailSchema.parse(body);

    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: validatedData.token,
        emailVerificationExpires: {
          gte: new Date(),
        },
      },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    await prisma.tenant.update({
      where: { id: user.tenantId },
      data: {
        emailVerified: true,
      },
    });

    await sendWelcomeEmail(
      user.email,
      user.firstName,
      user.tenant.name,
      user.tenant.brandColorMain || undefined
    );

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Email verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
