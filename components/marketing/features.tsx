import Image from 'next/image';
import { 
  Building, 
  Users, 
  FileText, 
  Wrench, 
  PieChart, 
  Smartphone,
  Check
} from 'lucide-react';

const features = [
  {
    name: 'Comprehensive Property Dashboard',
    description: 'Get a bird\'s eye view of your entire portfolio. Track occupancy rates, revenue trends, and critical alerts in real-time with our intuitive dashboard designed for clarity and control.',
    icon: Building,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Seamless Tenant Portal',
    description: 'Empower your tenants with a modern self-service portal. They can pay rent online, submit maintenance requests, and view lease documents, reducing your administrative workload.',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Smart Maintenance Tracking',
    description: 'Never let a repair slip through the cracks. Automate work orders, assign vendors, and keep tenants updated with status notifications, all from a single centralized system.',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1581578731117-104f8a7469d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  }
];

export function Features() {
  return (
    <div id="features" className="bg-white py-24 sm:py-32 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-amber-600 uppercase tracking-wide">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Complete Toolkit for Property Managers
          </p>
          <p className="mt-6 text-lg leading-8 text-stone-600">
            Manage Midziyo simplifies the complexities of property management, combining enterprise-grade power with a warm, user-friendly experience.
          </p>
        </div>

        <div className="flex flex-col gap-20">
          {features.map((feature, index) => (
            <div key={feature.name} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-xl text-amber-600">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900">{feature.name}</h3>
                <p className="text-lg text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3 mt-4">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-stone-700">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>Streamlined workflow optimization</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-100">
                  <div className="aspect-[4/3] relative">
                    <Image 
                      src={feature.image} 
                      alt={feature.name}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
