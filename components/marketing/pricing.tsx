import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    href: '/auth/register?plan=starter',
    price: '$49',
    description: 'Perfect for small property management companies or individual landlords.',
    features: [
      'Up to 10 Properties',
      '3 User Accounts',
      '1 Office Location',
      'Basic Property Management',
      'Tenant Portal',
      'Payment Tracking',
      'Email Notifications',
    ],
    featured: false,
  },
  {
    name: 'Growth',
    id: 'tier-growth',
    href: '/auth/register?plan=growth',
    price: '$149',
    description: 'Ideal for growing portfolios needing advanced branding and reporting.',
    features: [
      'Up to 50 Properties',
      '10 User Accounts',
      '5 Office Locations',
      'Everything in Starter',
      'Custom Branding',
      'Custom Domain Support',
      'Maintenance Tracking',
      'Advanced Reporting',
      'Priority Support',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    href: '/auth/register?plan=enterprise',
    price: '$399',
    description: 'Dedicated support and unlimited scale for large operations.',
    features: [
      'Unlimited Properties',
      'Unlimited Users',
      'Unlimited Offices',
      'Everything in Growth',
      'White-label Solution',
      'API Access',
      'Audit Logs',
      'Dedicated Account Manager',
    ],
    featured: false,
  },
];

export function Pricing() {
  return (
    <div id="pricing" className="bg-stone-100 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Choose the plan that fits your portfolio size. No hidden fees. Upgrade or cancel anytime.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-slate-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
          <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-3 lg:gap-x-8 w-full">
            {tiers.map((tier) => (
              <div 
                key={tier.id} 
                className={`
                  flex flex-col justify-between rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl
                  ${tier.featured ? 'ring-2 ring-amber-500 scale-105 z-10 shadow-lg' : 'ring-1 ring-slate-200 hover:scale-[1.02]'} 
                  xl:p-10
                `}
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3 className={`text-lg font-semibold leading-8 ${tier.featured ? 'text-amber-600' : 'text-slate-900'}`}>
                      {tier.name}
                    </h3>
                    {tier.featured && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold leading-5 text-amber-600">
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{tier.description}</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">{tier.price}</span>
                    <span className="text-sm font-semibold leading-6 text-slate-600">/month</span>
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <Check className={`h-6 w-5 flex-none ${tier.featured ? 'text-amber-500' : 'text-slate-400'}`} aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={tier.href} className="mt-8">
                  <Button 
                    className={`w-full h-12 text-base ${tier.featured ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
                    variant={tier.featured ? 'default' : 'outline'}
                    size="lg"
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
