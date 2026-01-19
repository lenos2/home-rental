import { cookies } from 'next/headers';
import { verifyToken, JWTPayload } from './jwt';
import { prisma } from './db';
import { User, Role } from '@prisma/client';

export async function getCurrentUser(): Promise<(User & { role: Role | null }) | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { role: true },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAuth(): Promise<User & { role: Role | null }> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function getSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    return await verifyToken(token);
  } catch (error) {
    return null;
  }
}
