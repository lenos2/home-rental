import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, FileText, Users, Wrench, DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const [
    propertiesCount,
    leasesCount,
    tenantsCount,
    maintenanceCount,
    activeLeases,
  ] = await Promise.all([
    prisma.property.count({ where: { tenantId: user.tenantId } }),
    prisma.lease.count({ where: { tenantId: user.tenantId } }),
    prisma.propertyTenant.count({ where: { tenantId: user.tenantId } }),
    prisma.maintenanceRequest.count({
      where: {
        tenantId: user.tenantId,
        status: { in: ['open', 'in_progress'] },
      },
    }),
    prisma.lease.findMany({
      where: {
        tenantId: user.tenantId,
        status: 'active',
      },
      include: {
        property: true,
        propertyTenant: true,
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const stats = [
    {
      title: 'Total Properties',
      value: propertiesCount,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Leases',
      value: leasesCount,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Tenants',
      value: tenantsCount,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Open Maintenance',
      value: maintenanceCount,
      icon: Wrench,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.firstName}! Here&apos;s your property overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Active Leases</CardTitle>
          </CardHeader>
          <CardContent>
            {activeLeases.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active leases</p>
            ) : (
              <div className="space-y-4">
                {activeLeases.map((lease) => (
                  <div
                    key={lease.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {lease.propertyTenant.firstName} {lease.propertyTenant.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lease.property.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(Number(lease.monthlyRent))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        /month
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/dashboard/properties/new"
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Add Property</p>
                <p className="text-sm text-muted-foreground">
                  List a new property
                </p>
              </div>
            </a>
            <a
              href="/dashboard/leases/new"
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Create Lease</p>
                <p className="text-sm text-muted-foreground">
                  Start a new lease agreement
                </p>
              </div>
            </a>
            <a
              href="/dashboard/tenants/new"
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors"
            >
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Add Tenant</p>
                <p className="text-sm text-muted-foreground">
                  Register a new tenant
                </p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
