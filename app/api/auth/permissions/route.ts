import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { Permissions } from '@/lib/permissions';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const permissions: Permissions = user.role?.permissions as Permissions || {};

    return NextResponse.json({
      permissions,
    });
  } catch (error) {
    console.error('Get permissions error:', error);
    return NextResponse.json(
      { error: 'Failed to get permissions' },
      { status: 500 }
    );
  }
}
