import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function CallToAction() {
  return (
    <div className="relative isolate overflow-hidden bg-stone-900 py-24 sm:py-32">
      <Image
        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
        alt="Office background"
        fill
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-900 via-stone-900/80 to-stone-900/40" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to streamline your property operations?
            <br />
            <span className="text-amber-400">Start your free trial today.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-stone-300">
            Join thousands of property managers who have switched to Manage Midziyo for better efficiency, happier tenants, and smarter growth.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/register">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white border-0 h-14 px-8 text-lg font-semibold shadow-xl transition-all hover:translate-y-[-2px]">
                Get started
              </Button>
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-white flex items-center gap-1 hover:text-amber-300 transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
