# Getting Started with Midziyo Manager

**Powering Smarter Property Operations**

## 🎉 What's Been Built

You now have a **production-ready foundation** for Midziyo Manager, a comprehensive Property Rental SaaS platform with:

### ✅ Complete Features
1. **Multi-Tenant Architecture** - Full data isolation per company
2. **Authentication System** - JWT-based with email verification
3. **Database Schema** - Complete schema for all entities
4. **UI Component Library** - Modern, accessible components
5. **Dashboard Layout** - Professional admin interface
6. **Email System** - Automated notifications with templates
7. **RBAC System** - Role-based access control
8. **Feature Gating** - Subscription-based feature access
9. **Middleware** - Route protection and tenant resolution

### 📁 Project Structure
```
home-rental/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── api/auth/            # Auth API routes
│   ├── dashboard/           # Admin dashboard
│   └── page.tsx             # Home (redirects to dashboard)
├── components/
│   ├── ui/                  # Reusable UI components
│   └── dashboard/           # Dashboard-specific components
├── lib/
│   ├── auth.ts              # Auth helpers
│   ├── db.ts                # Prisma client
│   ├── email.ts             # Email service
│   ├── features.ts          # Feature gating
│   ├── jwt.ts               # JWT utilities
│   ├── permissions.ts       # RBAC system
│   ├── utils.ts             # Helper functions
│   └── validations.ts       # Zod schemas
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed-plans.ts        # Seed subscription plans
│   └── seed-superadmin.ts   # Create super admin
└── middleware.ts            # Route protection
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file (copy from `.env.example`):

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/property_rental"
DIRECT_URL="postgresql://user:password@localhost:5432/property_rental"

# Application (Required)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="your-secret-key-min-32-characters"

# Email (Optional for development)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="Midziyo Manager <noreply@midziyomanager.com>"
```

### 3. Setup Database
```bash
# Run migrations
npx prisma migrate dev --name init

# Seed subscription plans
npx tsx prisma/seed-plans.ts

# Optional: Create super admin
npx tsx prisma/seed-superadmin.ts
```

### 4. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Test the Application

### Register a New Account
1. Go to http://localhost:3000/auth/register
2. Fill in company and user details
3. Submit the form
4. Check console for verification email (development mode)
5. You'll be redirected to the dashboard

### Login
1. Go to http://localhost:3000/auth/login
2. Enter your credentials
3. Access the dashboard

### Dashboard Features
- View statistics (properties, leases, tenants, maintenance)
- Navigate between sections
- Access user menu
- Logout functionality

## 📊 Database Schema Highlights

### Core Models
- **Tenant** - Property management companies
- **User** - Staff and tenant users with RBAC
- **Subscription** - Plan management with limits
- **SubscriptionPlan** - Starter, Growth, Enterprise
- **Property** - Property listings
- **Lease** - Lease agreements
- **PropertyTenant** - Tenant (renter) information
- **MaintenanceRequest** - Maintenance tracking
- **Payment** - Payment records
- **Invoice** - Invoice generation

### Key Features
- Multi-tenant with complete isolation
- Subscription-based feature gating
- Role-based permissions
- Audit logging
- Custom domain support
- Email verification

## 🔐 Authentication Flow

### Registration
1. User submits registration form
2. System creates tenant, subscription, role, and user
3. Email verification sent
4. User redirected to dashboard
5. Email verification required for full access

### Login
1. User submits credentials
2. System validates email/password
3. JWT token generated and stored in HTTP-only cookie
4. User redirected to dashboard

### Password Reset
1. User requests password reset
2. Email sent with reset token
3. User clicks link and sets new password
4. User can login with new password

## 🎨 UI Components Available

### Form Components
- `Button` - Multiple variants (default, destructive, outline, ghost, link)
- `Input` - Text inputs with validation
- `Textarea` - Multi-line text input
- `Select` - Dropdown selection
- `Label` - Form labels

### Display Components
- `Card` - Content containers with header/footer
- `Badge` - Status indicators
- `Alert` - Notifications and messages
- `Loading` - Loading states and skeletons
- `EmptyState` - Empty state placeholders

## 🛠️ Development Tools

### Prisma Studio
View and edit database records:
```bash
npx prisma studio
```

### Type Generation
Regenerate Prisma types:
```bash
npx prisma generate
```

### Database Migrations
Create new migration:
```bash
npx prisma migrate dev --name migration_name
```

Reset database:
```bash
npx prisma migrate reset
```

## 📝 Next Steps for Full Implementation

### Phase 1: Property Management
- Create property list page with filters
- Build property create/edit forms
- Add property detail page
- Implement property search
- Add category management
- Create API routes for CRUD operations

### Phase 2: Lease Management
- Build lease list page
- Create lease forms
- Add lease detail page
- Implement status workflow
- Add renewal system

### Phase 3: Tenant Management
- Create tenant list page
- Build tenant forms
- Add tenant detail page
- Implement background check tracking

### Phase 4: Tenant Portal
- Build tenant dashboard
- Add payment submission
- Create maintenance request form
- Add lease document access

### Phase 5: Maintenance System
- Create maintenance list page
- Build request forms
- Add assignment system
- Implement status tracking

### Phase 6: Payment & Invoicing
- Build payment list page
- Add payment recording
- Create invoice generation
- Implement payment history

### Phase 7: Calendar
- Create calendar component
- Add event management
- Implement lease date tracking

### Phase 8: Analytics & Reporting
- Build dashboard metrics
- Add revenue charts
- Create occupancy reports
- Implement export functionality

### Phase 9: Super Admin Panel
- Create tenant management
- Add subscription management
- Build analytics dashboard

### Phase 10: Public Website
- Create property search page
- Build property detail page
- Add application form

## 🔧 Configuration

### Email Providers
The system supports multiple email providers:
- **Gmail**: Use app-specific password
- **SendGrid**: Use API key as password
- **Resend**: Configure with API key
- **Development**: Emails logged to console

### Subscription Plans
Three tiers are pre-configured:
- **Starter** ($49/month): 10 properties, 3 users, 1 office
- **Growth** ($149/month): 50 properties, 10 users, 5 offices
- **Enterprise** ($399/month): Unlimited everything

Modify in `prisma/seed-plans.ts`

### Feature Gates
Features are gated by subscription tier:
- `customDomain` - Growth+
- `advancedBranding` - Growth+
- `maintenanceTracking` - Growth+
- `advancedReporting` - Growth+
- `multiOffice` - Growth+
- `auditLogs` - Enterprise
- `whiteLabel` - Enterprise
- `apiAccess` - Enterprise

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check firewall settings

### Email Not Sending
- In development, emails are logged to console
- For production, configure SMTP settings
- Verify EMAIL_USER and EMAIL_PASS

### Authentication Issues
- Clear browser cookies
- Verify JWT_SECRET is set
- Check token expiration (7 days default)

### Build Errors
- Run `npm install` to ensure all dependencies
- Run `npx prisma generate` to regenerate types
- Clear `.next` folder and rebuild

## 📚 Additional Resources

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev)

### Deployment
- [Vercel Deployment](https://vercel.com/docs)
- [Database Hosting](https://neon.tech)
- [Email Services](https://resend.com)

## 💡 Tips

1. **Start Small**: Implement one feature at a time
2. **Test Thoroughly**: Test each feature before moving on
3. **Use Prisma Studio**: Great for debugging database issues
4. **Check Console**: Development mode logs helpful information
5. **Read the Code**: All code is well-commented and organized

## 🎓 Learning Path

1. Understand the authentication flow
2. Explore the database schema
3. Study the component library
4. Review the API routes
5. Build your first feature (properties recommended)
6. Expand to other features

## ✨ Key Features to Highlight

- **Type-Safe**: Full TypeScript coverage
- **Secure**: JWT auth, RBAC, data isolation
- **Scalable**: Multi-tenant architecture
- **Modern**: Next.js 14, App Router, Server Components
- **Professional**: Production-ready code quality
- **Documented**: Comprehensive documentation

## 🚀 Ready to Build!

You have everything you need to build a complete Property Rental SaaS platform. The foundation is solid, secure, and scalable. Start with property management and build from there!

**Happy coding! 🎉**
