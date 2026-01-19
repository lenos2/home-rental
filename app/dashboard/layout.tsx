import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { UserNav } from '@/components/dashboard/user-nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav user={user} />
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-white">
          <div className="flex h-16 items-center px-6 justify-between">
            <h2 className="text-lg font-semibold">Manage Midziyo</h2>
            <UserNav user={user} />
          </div>
        </header>
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
