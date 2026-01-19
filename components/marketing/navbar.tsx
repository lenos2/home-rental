'use client';

import Link from 'next/link';
import { Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-amber-600" />
              <span className="text-xl font-bold text-stone-900">Manage Midziyo</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors">
                About
              </Link>
              <Link href="/auth/login" className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors">
                Log in
              </Link>
              <Link href="/auth/register">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white border-0">Get Started</Button>
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-stone-600 hover:text-stone-900 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-40">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="#features"
              className="block rounded-md px-3 py-2 text-base font-medium text-stone-600 hover:bg-amber-50 hover:text-amber-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="block rounded-md px-3 py-2 text-base font-medium text-stone-600 hover:bg-amber-50 hover:text-amber-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/auth/login"
              className="block rounded-md px-3 py-2 text-base font-medium text-stone-600 hover:bg-amber-50 hover:text-amber-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Log in
            </Link>
            <div className="mt-4 px-3 pb-2">
              <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white border-0">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
