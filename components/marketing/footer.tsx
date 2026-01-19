import Link from 'next/link';
import { Building2, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-amber-600" />
              <span className="text-lg font-bold text-slate-900">Manage Midziyo</span>
            </Link>
            <p className="text-sm text-slate-600 max-w-xs">
              Powering Smarter Property Operations. The complete solution for modern property management.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">Tenant Portal</Link></li>
              <li><Link href="#" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">Owner Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">About</Link></li>
              <li><Link href="#" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-slate-600 hover:text-amber-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Manage Midziyo. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
