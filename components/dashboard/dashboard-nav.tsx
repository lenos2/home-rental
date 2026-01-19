'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Building2,
  Home,
  FileText,
  Users,
  Wrench,
  DollarSign,
  Calendar,
  BarChart3,
  Settings,
  Building,
} from 'lucide-react';

interface DashboardNavProps {
  user: any;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Properties', href: '/dashboard/properties', icon: Building2 },
  { name: 'Leases', href: '/dashboard/leases', icon: FileText },
  { name: 'Tenants', href: '/dashboard/tenants', icon: Users },
  { name: 'Maintenance', href: '/dashboard/maintenance', icon: Wrench },
  { name: 'Payments', href: '/dashboard/payments', icon: DollarSign },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Offices', href: '/dashboard/offices', icon: Building },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <Building2 className="h-6 w-6 text-primary mr-2" />
        <span className="font-semibold text-lg">Manage Midziyo</span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
