import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CheckCircle2, PlayCircle } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-[85vh] overflow-hidden">
      <div className="absolute top-0 w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-2a4d9fdd4070?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2600&q=80"
          alt="Modern property exterior"
          fill
          className="object-cover"
          priority
        />
        <span id="blackOverlay" className="w-full h-full absolute opacity-70 bg-stone-900/80"></span>
      </div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-wrap items-center">
          <div className="w-full lg:w-8/12 px-4 ml-auto mr-auto text-center">
            <h1 className="text-white font-bold text-5xl sm:text-6xl mb-6 leading-tight">
              Manage Midziyo
              <span className="block text-amber-400 mt-2">Powering Smarter Property Operations</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-stone-200 mb-8 font-light max-w-3xl mx-auto">
              The complete solution for modern property management. Streamline your rental business with enterprise-grade tools wrapped in a warm, intuitive interface.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white border-0 h-14 px-8 text-lg w-full sm:w-auto shadow-xl transition-all hover:translate-y-[-2px]">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white h-14 px-8 text-lg w-full sm:w-auto backdrop-blur-sm">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  See How It Works
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-stone-300">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
