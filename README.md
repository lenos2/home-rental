# Manage Midziyo — Powering Smarter Property Operations

A comprehensive multi-tenant property rental management platform built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

- 🏢 **Multi-Tenant Architecture** - Complete data isolation per property management company
- 🔐 **Authentication & Authorization** - JWT-based auth with RBAC
- 💳 **Subscription Management** - Three-tier pricing (Starter, Growth, Enterprise)
- 🏠 **Property Management** - Full CRUD with categories, search, and filtering
- 📝 **Lease Management** - Complete lease lifecycle with status workflow
- 👥 **Tenant Portal** - Self-service portal for tenants
- 🔧 **Maintenance Tracking** - Request and track maintenance issues
- 💰 **Payment Processing** - Payment tracking and invoice generation
- 📊 **Analytics & Reporting** - Tiered analytics based on subscription
- 🎨 **Custom Branding** - Logo, colors, and custom domain support
- 📧 **Email Notifications** - Automated email system with templates
- 🔒 **Security** - Audit logs, data encryption, and secure sessions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with jose (Edge-compatible)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Email**: Nodemailer
- **Validation**: Zod
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or hosted on Neon/Supabase)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd home-rental
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `DIRECT_URL` - Direct database connection (for migrations)
   - `JWT_SECRET` - Secret key for JWT tokens
   - `NEXT_PUBLIC_APP_URL` - Your app URL
   - Email configuration (SMTP settings)

4. **Set up the database**
   ```bash
   # Run migrations
   npx prisma migrate dev

   # Seed subscription plans
   npx tsx prisma/seed-plans.ts

   # Create super admin (optional)
   npx tsx prisma/seed-superadmin.ts
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The platform uses a comprehensive multi-tenant schema with the following core models:

- **Tenant** - Property management companies
- **User** - Staff and tenant users with RBAC
- **Subscription** - Plan management with feature gating
- **Property** - Property listings with full details
- **Lease** - Lease agreements and terms
- **PropertyTenant** - Tenant information
- **MaintenanceRequest** - Maintenance tracking
- **Payment** - Payment records
- **Invoice** - Invoice generation

## Subscription Plans

### Starter ($49/month)
- 10 properties
- 3 users
- 1 office
- Basic features

### Growth ($149/month)
- 50 properties
- 10 users
- 5 offices
- Custom branding
- Custom domain
- Advanced reporting
- Priority support

### Enterprise ($399/month)
- Unlimited properties
- Unlimited users
- Unlimited offices
- White-label
- API access
- Audit logs
- Dedicated support

## API Routes

### Authentication
- `POST /api/auth/register` - Register new tenant
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user
- `GET /api/auth/permissions` - Get user permissions

### Properties
- `GET /api/properties` - List properties
- `POST /api/properties` - Create property
- `GET /api/properties/[id]` - Get property
- `PATCH /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

### Leases
- `GET /api/leases` - List leases
- `POST /api/leases` - Create lease
- `GET /api/leases/[id]` - Get lease
- `PATCH /api/leases/[id]` - Update lease
- `DELETE /api/leases/[id]` - Delete lease

### Additional endpoints for tenants, maintenance, payments, etc.

## Project Structure

```
home-rental/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/            # Auth pages
│   ├── dashboard/         # Admin dashboard
│   ├── tenant-portal/     # Tenant portal
│   └── superadmin/        # Super admin panel
├── components/            # React components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   └── layouts/          # Layout components
├── lib/                   # Utilities and helpers
│   ├── db.ts             # Prisma client
│   ├── auth.ts           # Auth helpers
│   ├── jwt.ts            # JWT utilities
│   ├── email.ts          # Email service
│   ├── permissions.ts    # RBAC system
│   ├── features.ts       # Feature gating
│   └── validations.ts    # Zod schemas
├── prisma/               # Database schema
│   ├── schema.prisma     # Prisma schema
│   ├── seed-plans.ts     # Seed subscription plans
│   └── seed-superadmin.ts # Seed super admin
└── public/               # Static assets
```

## Development

### Running Prisma Studio
```bash
npx prisma studio
```

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

### Type Generation
```bash
npx prisma generate
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- Database URLs
- JWT secret
- Email configuration
- Stripe keys (if using)
- App URL

## Security

- JWT tokens with 7-day expiration
- Password hashing with bcrypt
- Email verification required
- Tenant-scoped data access
- Audit logging for critical actions
- HTTPS in production
- CSRF protection
- Rate limiting (recommended)

## Contributing

This is a comprehensive SaaS platform. Contributions are welcome!

## License

Proprietary - All rights reserved

## Support

For support, email support@managemidziyo.com

---

Built with ❤️ using Next.js 14 and TypeScript
