import { Subscription, SubscriptionPlan } from '@prisma/client';

export type FeatureKey =
  | 'customDomain'
  | 'advancedBranding'
  | 'maintenanceTracking'
  | 'advancedReporting'
  | 'multiOffice'
  | 'auditLogs'
  | 'whiteLabel'
  | 'apiAccess'
  | 'prioritySupport'
  | 'dedicatedAccount';

export interface SubscriptionLimits {
  maxProperties: number;
  maxUsers: number;
  maxOffices: number;
}

export interface SubscriptionUsage {
  properties: number;
  users: number;
  offices: number;
}

export interface UsageStatus {
  properties: {
    used: number;
    limit: number;
    percentage: number;
    canAdd: boolean;
  };
  users: {
    used: number;
    limit: number;
    percentage: number;
    canAdd: boolean;
  };
  offices: {
    used: number;
    limit: number;
    percentage: number;
    canAdd: boolean;
  };
}

export function hasFeature(
  subscription: Subscription & { plan: SubscriptionPlan },
  feature: FeatureKey
): boolean {
  const tier = subscription.plan.tier;
  
  const featureMap: Record<string, FeatureKey[]> = {
    starter: [],
    growth: [
      'customDomain',
      'advancedBranding',
      'maintenanceTracking',
      'advancedReporting',
      'multiOffice',
      'prioritySupport',
    ],
    enterprise: [
      'customDomain',
      'advancedBranding',
      'maintenanceTracking',
      'advancedReporting',
      'multiOffice',
      'auditLogs',
      'whiteLabel',
      'apiAccess',
      'prioritySupport',
      'dedicatedAccount',
    ],
  };

  return featureMap[tier || 'starter']?.includes(feature) || false;
}

export function getSubscriptionLimits(
  subscription: Subscription & { plan: SubscriptionPlan }
): SubscriptionLimits {
  return {
    maxProperties: subscription.maxPropertiesOverride ?? subscription.plan.maxProperties,
    maxUsers: subscription.maxUsersOverride ?? subscription.plan.maxUsers,
    maxOffices: subscription.maxOfficesOverride ?? subscription.plan.maxOffices,
  };
}

export function canAddProperty(
  subscription: Subscription & { plan: SubscriptionPlan },
  currentCount: number
): boolean {
  const limits = getSubscriptionLimits(subscription);
  if (limits.maxProperties === -1) return true;
  return currentCount < limits.maxProperties;
}

export function canAddUser(
  subscription: Subscription & { plan: SubscriptionPlan },
  currentCount: number
): boolean {
  const limits = getSubscriptionLimits(subscription);
  if (limits.maxUsers === -1) return true;
  return currentCount < limits.maxUsers;
}

export function canAddOffice(
  subscription: Subscription & { plan: SubscriptionPlan },
  currentCount: number
): boolean {
  const limits = getSubscriptionLimits(subscription);
  if (limits.maxOffices === -1) return true;
  return currentCount < limits.maxOffices;
}

export function getUsageStatus(
  limits: SubscriptionLimits,
  usage: SubscriptionUsage
): UsageStatus {
  const calculateStatus = (used: number, limit: number) => {
    if (limit === -1) {
      return {
        used,
        limit: -1,
        percentage: 0,
        canAdd: true,
      };
    }
    return {
      used,
      limit,
      percentage: (used / limit) * 100,
      canAdd: used < limit,
    };
  };

  return {
    properties: calculateStatus(usage.properties, limits.maxProperties),
    users: calculateStatus(usage.users, limits.maxUsers),
    offices: calculateStatus(usage.offices, limits.maxOffices),
  };
}

export function isSubscriptionActive(subscription: Subscription): boolean {
  return subscription.status === 'active' || subscription.status === 'trialing';
}

export function isSubscriptionExpired(subscription: Subscription): boolean {
  return new Date() > new Date(subscription.currentPeriodEnd);
}

export function getDaysUntilExpiry(subscription: Subscription): number {
  const now = new Date();
  const end = new Date(subscription.currentPeriodEnd);
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
