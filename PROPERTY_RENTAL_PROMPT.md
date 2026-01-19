# Comprehensive AI Prompt: Property Rental SaaS Platform

## Project Overview

Build a production-ready, multi-tenant SaaS application for property rental businesses (residential, commercial, vacation rentals). The platform should enable property management companies to manage their portfolios, handle tenant applications, process payments, and provide a branded public-facing website for property listings.

---

## Tech Stack Requirements

### Core Technologies
- **Framework**: Next.js 14 with App Router (TypeScript)
- **Database**: PostgreSQL (hosted on Neon or similar serverless provider)
- **ORM**: Prisma with full type safety
- **Authentication**: Custom JWT using `jose` library (Edge-compatible)
- **Styling**: Tailwind CSS with responsive design
- **UI Components**: Modern component library (shadcn/ui style)
- **Icons**: Lucide React
- **Deployment**: Vercel-optimized with Edge Runtime support

### Additional Libraries
- **Email**: Nodemailer with multiple provider support (SendGrid, Resend, Gmail)
- **Payments**: Stripe integration + local payment gateways (configurable)
- **Charts**: Recharts for analytics dashboards
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date operations

---

## System Architecture

### Multi-Tenancy Model
- **Tenant Isolation**: Complete data isolation per property management company
- **Tenant Access Methods**:
  - Custom domain routing (e.g., `acme-properties.com`)
  - Platform subdomain paths (e.g., `platform.com/t/acme-properties`)
- **Middleware-Based Resolution**: Automatic tenant detection and context injection

### Authentication & Security
- JWT-based authentication with Edge runtime compatibility
- Role-Based Access Control (RBAC) with fine-grained permissions
- Email verification system with secure token generation
- Password reset flow with time-limited tokens
- Tenant-scoped data access (all queries filtered by tenantId)
- Audit logging for critical actions

---

## Database Schema Design

### Core Entities

#### 1. Tenant & Subscription
```prisma
model Tenant {
  id                  String    @id @default(uuid())
  name                String
  slug                String    @unique
  email               String
  phone               String?
  logoUrl             String?
  website             String?
  
  // Branding & Customization
  brandColorMain      String?   @default("#3B82F6")
  brandColorAccent    String?   @default("#10B981")
  brandColorText      String?   @default("#1F2937")
  customCss           String?   @db.Text
  searchDesign        String?   @default("modern") // modern, minimal, gradient
  backgroundType      String?   @default("default") // default, color, image
  backgroundColor     String?
  backgroundImage     String?
  
  // Business Details
  businessAddress     String?
  businessLicense     String?
  taxId               String?
  
  // Status
  status              String    @default("active") // active, suspended, trialing
  emailVerified       Boolean   @default(false)
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  // Relations
  subscription        Subscription?
  tenantDomains       TenantDomain[]
  users               User[]
  properties          Property[]
  leases              Lease[]
  tenants             PropertyTenant[]
  offices             Office[]
  categories          PropertyCategory[]
  roles               Role[]
  auditLogs           AuditLog[]
}

model SubscriptionPlan {
  id            String   @id @default(uuid())
  name          String   @unique
  tier          String?  @unique // starter, growth, enterprise
  description   String?
  price         Decimal  @db.Decimal(10, 2)
  currency      String   @default("USD")
  
  // Feature Flags (JSON array)
  features      Json?
  
  // Limits
  maxProperties Int      @default(10)  // -1 for unlimited
  maxUsers      Int      @default(5)   // -1 for unlimited
  maxOffices    Int      @default(1)   // -1 for unlimited
  
  isActive      Boolean  @default(true)
  displayOrder  Int      @default(0)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  subscriptions Subscription[]
}

model Subscription {
  id                    String   @id @default(uuid())
  tenantId              String   @unique
  tenant                Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  planId                String
  plan                  SubscriptionPlan @relation(fields: [planId], references: [id])
  
  status                String   // active, trialing, past_due, canceled, expired
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  trialEndsAt           DateTime?
  canceledAt            DateTime?
  
  // Override Limits (for custom plans)
  maxPropertiesOverride Int?
  maxUsersOverride      Int?
  maxOfficesOverride    Int?
  
  // Payment Integration
  stripeCustomerId      String?
  stripeSubscriptionId  String?
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  invoices              Invoice[]
  payments              Payment[]
}

model TenantDomain {
  id              String   @id @default(uuid())
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  domain          String   @unique
  status          String   // pending, verified, active, failed
  verifiedAt      DateTime?
  sslEnabled      Boolean  @default(false)
  isPrimary       Boolean  @default(false)
  cnameTarget     String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([tenantId])
  @@index([domain])
}
```

#### 2. User Management & RBAC
```prisma
model User {
  id                String    @id @default(uuid())
  tenantId          String
  tenant            Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  email             String
  password          String
  firstName         String
  lastName          String
  phone             String?
  avatar            String?
  
  // User Type
  userType          String    @default("staff") // staff, property_tenant, owner
  
  // Role-Based Access Control
  roleId            String?
  role              Role?     @relation(fields: [roleId], references: [id])
  
  // Verification
  emailVerified     Boolean   @default(false)
  emailVerificationToken String?
  emailVerificationExpires DateTime?
  
  // Password Reset
  passwordResetToken String?
  passwordResetExpires DateTime?
  
  // Status
  status            String    @default("active") // active, inactive, suspended
  lastLoginAt       DateTime?
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  leases            Lease[]
  payments          Payment[]
  maintenanceRequests MaintenanceRequest[]
  auditLogs         AuditLog[]
  
  @@unique([tenantId, email])
  @@index([tenantId])
  @@index([email])
}

model Role {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String
  permissions Json     // Permission object with resources and actions
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  users       User[]
  
  @@unique([tenantId, name])
}
```

#### 3. Property Management
```prisma
model Property {
  id                String   @id @default(uuid())
  tenantId          String
  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Basic Information
  name              String
  description       String?  @db.Text
  propertyType      String   // residential, commercial, vacation, mixed
  
  // Category
  categoryId        String?
  category          PropertyCategory? @relation(fields: [categoryId], references: [id])
  
  // Location
  address           String
  city              String
  state             String
  zipCode           String
  country           String   @default("US")
  latitude          Decimal? @db.Decimal(10, 8)
  longitude         Decimal? @db.Decimal(11, 8)
  
  // Office Assignment
  officeId          String?
  office            Office?  @relation(fields: [officeId], references: [id])
  
  // Property Details
  bedrooms          Int?
  bathrooms         Decimal? @db.Decimal(3, 1)
  squareFeet        Int?
  lotSize           Decimal? @db.Decimal(10, 2)
  yearBuilt         Int?
  
  // Amenities & Features
  amenities         Json?    // Array of amenities
  features          Json?    // Additional features
  
  // Pricing
  baseRent          Decimal  @db.Decimal(10, 2)
  securityDeposit   Decimal? @db.Decimal(10, 2)
  currency          String   @default("USD")
  
  // Availability
  status            String   @default("available") // available, occupied, maintenance, unlisted
  availableFrom     DateTime?
  
  // Media
  images            Json?    // Array of image URLs
  featuredImage     String?
  virtualTourUrl    String?
  
  // Utilities & Fees
  utilitiesIncluded Json?    // Array of included utilities
  petPolicy         String?  // no_pets, cats_only, dogs_only, all_pets
  petDeposit        Decimal? @db.Decimal(10, 2)
  parkingSpaces     Int?     @default(0)
  parkingFee        Decimal? @db.Decimal(10, 2)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  leases            Lease[]
  maintenanceRequests MaintenanceRequest[]
  documents         PropertyDocument[]
  
  @@index([tenantId])
  @@index([status])
  @@index([propertyType])
}

model PropertyCategory {
  id          String     @id @default(uuid())
  tenantId    String
  tenant      Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String
  description String?
  basePrice   Decimal?   @db.Decimal(10, 2)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  properties  Property[]
  
  @@unique([tenantId, name])
}

model Office {
  id          String     @id @default(uuid())
  tenantId    String
  tenant      Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String
  address     String
  city        String
  state       String
  zipCode     String
  phone       String?
  email       String?
  isPrimary   Boolean    @default(false)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  properties  Property[]
  
  @@index([tenantId])
}
```

#### 4. Lease & Tenant Management
```prisma
model PropertyTenant {
  id                String   @id @default(uuid())
  tenantId          String   // Property management company ID
  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Personal Information
  firstName         String
  lastName          String
  email             String
  phone             String
  dateOfBirth       DateTime?
  
  // Emergency Contact
  emergencyContactName  String?
  emergencyContactPhone String?
  emergencyContactRelation String?
  
  // Employment
  employer          String?
  occupation        String?
  annualIncome      Decimal? @db.Decimal(12, 2)
  
  // Background Check
  backgroundCheckStatus String? // pending, approved, rejected
  backgroundCheckDate   DateTime?
  creditScore           Int?
  
  // Documents
  idDocument        String?
  proofOfIncome     String?
  
  status            String   @default("active") // active, inactive, blacklisted
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  leases            Lease[]
  
  @@unique([tenantId, email])
  @@index([tenantId])
}

model Lease {
  id                String   @id @default(uuid())
  tenantId          String
  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Lease Number
  leaseNumber       String   @unique
  
  // Property & Tenant
  propertyId        String
  property          Property @relation(fields: [propertyId], references: [id])
  propertyTenantId  String
  propertyTenant    PropertyTenant @relation(fields: [propertyTenantId], references: [id])
  
  // Additional Tenants (JSON array of tenant IDs for roommates)
  coTenants         Json?
  
  // Lease Terms
  startDate         DateTime
  endDate           DateTime
  leaseType         String   // fixed, month_to_month, short_term
  
  // Financial Terms
  monthlyRent       Decimal  @db.Decimal(10, 2)
  securityDeposit   Decimal  @db.Decimal(10, 2)
  petDeposit        Decimal? @db.Decimal(10, 2)
  otherDeposits     Json?    // Array of other deposits
  
  // Payment Schedule
  rentDueDay        Int      @default(1) // Day of month rent is due
  lateFeeAmount     Decimal? @db.Decimal(10, 2)
  lateFeeDays       Int?     @default(5) // Grace period before late fee
  
  // Status
  status            String   @default("pending") // pending, active, expired, terminated, renewed
  
  // Renewal
  autoRenew         Boolean  @default(false)
  renewalNoticeDate DateTime?
  
  // Termination
  terminationDate   DateTime?
  terminationReason String?
  
  // Documents
  leaseDocument     String?  // Signed lease PDF
  
  // Notes
  notes             String?  @db.Text
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  payments          Payment[]
  maintenanceRequests MaintenanceRequest[]
  
  @@index([tenantId])
  @@index([propertyId])
  @@index([status])
}
```

#### 5. Maintenance Management
```prisma
model MaintenanceRequest {
  id                String   @id @default(uuid())
  tenantId          String
  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Request Details
  requestNumber     String   @unique
  title             String
  description       String   @db.Text
  category          String   // plumbing, electrical, hvac, appliance, structural, other
  priority          String   @default("medium") // low, medium, high, emergency
  
  // Property & Lease
  propertyId        String
  property          Property @relation(fields: [propertyId], references: [id])
  leaseId           String?
  lease             Lease?   @relation(fields: [leaseId], references: [id])
  
  // Requester
  requestedById     String
  requestedBy       User     @relation(fields: [requestedById], references: [id])
  
  // Assignment
  assignedTo        String?  // Staff member or vendor
  assignedAt        DateTime?
  
  // Status & Timeline
  status            String   @default("open") // open, in_progress, on_hold, completed, cancelled
  scheduledDate     DateTime?
  completedDate     DateTime?
  
  // Cost
  estimatedCost     Decimal? @db.Decimal(10, 2)
  actualCost        Decimal? @db.Decimal(10, 2)
  
  // Media
  images            Json?    // Before/after photos
  
  // Notes
  notes             String?  @db.Text
  resolutionNotes   String?  @db.Text
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([tenantId])
  @@index([propertyId])
  @@index([status])
}
```

#### 6. Financial Management
```prisma
model Payment {
  id                String   @id @default(uuid())
  tenantId          String
  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Payment Details
  paymentNumber     String   @unique
  amount            Decimal  @db.Decimal(10, 2)
  currency          String   @default("USD")
  
  // Payment Type
  paymentType       String   // rent, deposit, late_fee, maintenance, other
  
  // Related Records
  leaseId           String?
  lease             Lease?   @relation(fields: [leaseId], references: [id])
  invoiceId         String?
  invoice           Invoice? @relation(fields: [invoiceId], references: [id])
  subscriptionId    String?
  subscription      Subscription? @relation(fields: [subscriptionId], references: [id])
  
  // Payment Method
  paymentMethod     String   // credit_card, bank_transfer, cash, check, stripe, other
  paymentProvider   String?  // stripe, paypal, etc.
  transactionId     String?
  
  // Status
  status            String   @default("pending") // pending, completed, failed, refunded
  paidAt            DateTime?
  
  // Payer
  paidById          String?
  paidBy            User?    @relation(fields: [paidById], references: [id])
  payerName         String?
  payerEmail        String?
  
  // Notes
  notes             String?  @db.Text
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([tenantId])
  @@index([leaseId])
  @@index([status])
}

model Invoice {
  id                String   @id @default(uuid())
  tenantId          String
  tenant            Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  // Invoice Details
  invoiceNumber     String   @unique
  
  // Related Records
  leaseId           String?
  lease             Lease?   @relation(fields: [leaseId], references: [id])
  subscriptionId    String?
  subscription      Subscription? @relation(fields: [subscriptionId], references: [id])
  
  // Financial Details
  subtotal          Decimal  @db.Decimal(10, 2)
  tax               Decimal  @db.Decimal(10, 2) @default(0)
  total             Decimal  @db.Decimal(10, 2)
  currency          String   @default("USD")
  
  // Line Items (JSON array)
  items             Json
  
  // Dates
  issueDate         DateTime @default(now())
  dueDate           DateTime
  paidDate          DateTime?
  
  // Status
  status            String   @default("pending") // pending, paid, overdue, cancelled
  
  // Notes
  notes             String?  @db.Text
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  // Relations
  payments          Payment[]
  
  @@index([tenantId])
  @@index([status])
}
```

#### 7. Documents & Audit
```prisma
model PropertyDocument {
  id          String   @id @default(uuid())
  tenantId    String
  propertyId  String
  property    Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  
  name        String
  type        String   // lease, inspection, certificate, insurance, other
  fileUrl     String
  fileSize    Int?
  mimeType    String?
  
  uploadedBy  String?
  uploadedAt  DateTime @default(now())
  
  @@index([propertyId])
}

model AuditLog {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  
  action      String   // create, update, delete, login, etc.
  resource    String   // property, lease, user, etc.
  resourceId  String?
  
  changes     Json?    // Before/after values
  ipAddress   String?
  userAgent   String?
  
  createdAt   DateTime @default(now())
  
  @@index([tenantId])
  @@index([userId])
  @@index([resource])
}
```

---

## Feature Requirements

### 1. Multi-Tenant SaaS Infrastructure

#### Subscription Tiers
**Starter Plan ($49/month)**
- Max Properties: 10
- Max Users: 3
- Max Offices: 1
- Features: Basic property management, tenant portal, payment tracking, email notifications

**Growth Plan ($149/month)**
- Max Properties: 50
- Max Users: 10
- Max Offices: 5
- Features: All Starter + Custom branding, custom domain, maintenance tracking, advanced reporting, priority support

**Enterprise Plan ($399/month)**
- Max Properties: Unlimited
- Max Users: Unlimited
- Max Offices: Unlimited
- Features: All Growth + White-label, API access, audit logs, dedicated account manager, multi-office management

#### Feature Gating System
Implement comprehensive feature gates with these keys:
- `customDomain` - Custom domain support (Growth+)
- `advancedBranding` - Custom colors, logos, CSS (Growth+)
- `maintenanceTracking` - Maintenance request system (Growth+)
- `advancedReporting` - Detailed analytics (Growth+)
- `multiOffice` - Multiple office locations (Growth+)
- `auditLogs` - Audit trail (Enterprise)
- `whiteLabel` - Remove platform branding (Enterprise)
- `apiAccess` - REST API access (Enterprise)
- `prioritySupport` - Priority support (Growth+)
- `dedicatedAccount` - Dedicated account manager (Enterprise)

#### Usage Enforcement
- Automatic enforcement of property, user, and office limits
- Real-time usage tracking with percentage utilization
- Upgrade prompts when limits are reached
- Grace period handling for plan downgrades

### 2. Authentication & User Management

#### User Types
1. **Staff Users** (Property Management Company)
   - Account Owner (full access)
   - Property Manager (operational access)
   - Maintenance Coordinator (maintenance-focused)
   - Leasing Agent (tenant-focused)
   - Viewer (read-only)

2. **Property Tenants** (Renters)
   - Tenant Portal access
   - Payment submission
   - Maintenance requests
   - Lease document access

#### Authentication Features
- Email/password registration with validation
- Email verification with secure tokens
- Password reset flow with time-limited tokens
- JWT-based session management (Edge-compatible)
- Role-based access control (RBAC) with fine-grained permissions
- User impersonation for support (audit logged)

#### RBAC System
Implement permission system with these resources:
- `properties` - Property management
- `leases` - Lease management
- `tenants` - Tenant management
- `maintenance` - Maintenance requests
- `payments` - Payment processing
- `users` - User management
- `roles` - Role management
- `settings` - Tenant settings
- `billing` - Subscription management
- `offices` - Office management
- `reports` - Analytics access

Actions per resource: `view`, `create`, `edit`, `delete`, `manage`

### 3. Property Management

#### Property Features
- **Property Listings**: Create, edit, delete properties with rich details
- **Property Categories**: Organize by type (residential, commercial, vacation)
- **Location Management**: Address, city, state, zip, coordinates for mapping
- **Property Details**: Bedrooms, bathrooms, square footage, lot size, year built
- **Amenities**: Configurable amenity list (pool, gym, parking, etc.)
- **Pricing**: Base rent, security deposit, pet deposit, parking fees
- **Media Management**: Multiple images with featured image, virtual tour URLs
- **Availability Status**: Available, occupied, maintenance, unlisted
- **Office Assignment**: Multi-office support for enterprise plans

#### Search & Filtering
- Public property search with date availability
- Filter by property type, bedrooms, bathrooms, price range
- Location-based search with map view
- Category filtering
- Amenity filtering

### 4. Lease Management

#### Lease Lifecycle
- **Application Process**: Tenant application with background check tracking
- **Lease Creation**: Generate leases with customizable terms
- **Lease Types**: Fixed-term, month-to-month, short-term
- **Co-Tenants**: Support for multiple tenants on one lease
- **Status Workflow**: pending → active → expired/terminated/renewed
- **Auto-Renewal**: Optional automatic lease renewal
- **Termination**: Track termination date and reason

#### Lease Features
- Sequential lease numbers (LS-001000, LS-001001, etc.)
- Customizable rent due date
- Late fee configuration with grace period
- Security deposit tracking
- Pet deposit and policy management
- Lease document upload and storage
- Renewal notifications

### 5. Tenant Portal

#### Tenant Dashboard
- Overview with lease details and payment status
- Upcoming rent payments
- Payment history
- Active maintenance requests
- Lease document access
- Profile management

#### Tenant Features
- Online rent payment submission
- Maintenance request submission with photos
- Lease renewal requests
- Communication with property manager
- Document downloads (lease, receipts)

### 6. Maintenance Management

#### Maintenance Request System
- **Request Creation**: Tenants and staff can create requests
- **Categories**: Plumbing, electrical, HVAC, appliance, structural, other
- **Priority Levels**: Low, medium, high, emergency
- **Status Workflow**: open → in_progress → on_hold → completed/cancelled
- **Assignment**: Assign to staff members or vendors
- **Scheduling**: Schedule maintenance dates
- **Cost Tracking**: Estimated vs actual costs
- **Media**: Before/after photos
- **Notes**: Internal notes and resolution details

#### Maintenance Features
- Sequential request numbers (MR-001000, MR-001001, etc.)
- Email notifications for status changes
- Priority-based sorting
- Vendor management (future enhancement)
- Recurring maintenance schedules (future enhancement)

### 7. Payment & Financial Management

#### Payment Processing
- **Payment Types**: Rent, deposit, late fees, maintenance charges
- **Payment Methods**: Credit card (Stripe), bank transfer, cash, check
- **Payment Status**: Pending, completed, failed, refunded
- **Payment Tracking**: Link payments to leases and invoices
- **Receipt Generation**: Automatic receipt emails

#### Invoice System
- **Invoice Generation**: Automatic monthly rent invoices
- **Invoice Items**: Line-item breakdown with subtotal, tax, total
- **Invoice Status**: Pending, paid, overdue, cancelled
- **Due Date Tracking**: Automatic overdue detection
- **Payment Linking**: Track partial and full payments

#### Financial Reporting
- Revenue tracking by property, office, or tenant
- Outstanding balance reports
- Payment history and trends
- Late payment tracking
- Security deposit accounting

### 8. Admin Dashboard

#### Dashboard Metrics
- Total properties (by status)
- Total active leases
- Monthly revenue (current and projected)
- Occupancy rate
- Pending maintenance requests
- Recent activity feed

#### Management Interfaces
- **Properties**: Grid/list view with search, filters, bulk actions
- **Leases**: Calendar view, list view with status filters
- **Tenants**: Tenant directory with search and filters
- **Maintenance**: Kanban board or list view with priority sorting
- **Payments**: Payment history with export functionality
- **Users**: User management with role assignment
- **Roles**: Role creation and permission management

### 9. Calendar & Scheduling

#### Calendar Views
- **Day View**: Detailed list of all events for selected day
- **Week View**: 7-column grid with today highlighting
- **Month View**: Full month grid with event overflow indicators
- **View Switcher**: Toggle between views with smart navigation

#### Calendar Events
- Lease start/end dates
- Rent due dates
- Scheduled maintenance
- Property inspections
- Lease renewal dates
- Move-in/move-out dates

#### Calendar Features
- Click day to create new lease or maintenance
- Click event to view details
- Color-coded events by type
- Today navigation button
- Drag-and-drop scheduling (future enhancement)

### 10. Public Website

#### Tenant-Branded Website
- **Custom Domain**: Support for custom domains (Growth+)
- **Branding**: Logo, colors, custom CSS
- **Search Hero**: Modern, minimal, or gradient design options
- **Property Listings**: Grid view with featured images
- **Property Details**: Full property page with gallery, amenities, map
- **Application Form**: Online tenant application submission
- **Contact Form**: Inquiry form for prospective tenants

#### SEO & Performance
- Server-side rendering for property pages
- Optimized images with Next.js Image component
- Meta tags for social sharing
- Sitemap generation
- Mobile-responsive design

### 11. Notification System

#### Email Notifications
- **Tenant Notifications**:
  - Lease approval/rejection
  - Rent due reminders (7, 3, 1 days before)
  - Payment confirmation
  - Maintenance request updates
  - Lease renewal reminders
  
- **Staff Notifications**:
  - New tenant applications
  - New maintenance requests
  - Payment received
  - Lease expiring soon
  - Overdue payments

- **Subscription Notifications**:
  - Trial ending (7, 3, 1, 0 days)
  - Subscription due (7, 3, 1, 0 days)
  - Subscription expired
  - Payment failed

#### Email Templates
- Professional HTML templates with tenant branding
- Responsive design for mobile devices
- Configurable SMTP settings (SendGrid, Resend, Gmail)
- Development mode with console logging

### 12. Super Admin Panel

#### Platform Management
- **Tenant Management**: View all tenants, suspend/activate accounts
- **Subscription Management**: Change plans, record payments, extend trials
- **User Management**: View all users, verify emails, reset passwords
- **Impersonation**: Login as any user for support (with audit logging)
- **Analytics**: Platform-wide metrics and usage statistics

#### Super Admin Features
- **Plan Overrides**: Custom limits for specific tenants
- **Billing Resolution**: Mark payments as received/failed
- **Tenant Deletion**: Cascade delete with confirmation
- **Activity Logs**: View audit logs for any tenant
- **Support Tools**: Email verification override, password reset
- **Notification Management**: View and manually trigger notifications

### 13. Reporting & Analytics

#### Tiered Analytics

**Starter Plan (Basic Analytics)**
- Current month metrics
- Property status breakdown
- Active leases count
- Recent payments (30 days)
- Basic occupancy rate

**Growth Plan (Advanced Analytics)**
- All Starter features
- 12-month revenue trends
- Lease renewal rates
- Average rent by property type
- Payment collection rates
- Maintenance cost tracking
- CSV export

**Enterprise Plan (Predictive Analytics)**
- All Growth features
- Revenue forecasting (3-6 months)
- Tenant lifetime value
- Property ROI analysis
- Multi-office comparison
- Custom report builder
- Scheduled email reports
- CSV/JSON/PDF export
- Analytics API access

### 14. Document Management

#### Document Features
- **Document Upload**: Support for PDF, images, Word docs
- **Document Types**: Leases, inspections, certificates, insurance
- **Document Storage**: Secure cloud storage with access control
- **Document Sharing**: Share documents with tenants
- **Document Versioning**: Track document versions
- **E-Signature Integration**: (future enhancement)

### 15. Settings & Customization

#### Tenant Settings
- **General**: Company info, contact details, business license
- **Branding**: Logo upload, brand colors, custom CSS
- **Domain**: Custom domain setup with DNS verification
- **Offices**: Multi-office management (Growth+)
- **Notifications**: Email notification preferences
- **Payment Methods**: Configure payment gateways
- **Lease Templates**: Customizable lease agreement templates

#### User Settings
- Profile management
- Password change
- Notification preferences
- Two-factor authentication (future enhancement)

---

## API Architecture

### API Endpoints Structure

#### Authentication
- `POST /api/auth/register` - Create tenant and owner user
- `POST /api/auth/login` - Authenticate and get JWT
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/permissions` - Get user permissions

#### Properties
- `GET /api/properties` - List properties (filtered by tenant)
- `POST /api/properties` - Create property (with limit check)
- `GET /api/properties/[id]` - Get property details
- `PATCH /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property
- `GET /api/properties/search` - Public property search
- `GET /api/properties/[id]/availability` - Check availability

#### Leases
- `GET /api/leases` - List leases
- `POST /api/leases` - Create lease
- `GET /api/leases/[id]` - Get lease details
- `PATCH /api/leases/[id]` - Update lease
- `DELETE /api/leases/[id]` - Delete lease
- `POST /api/leases/[id]/renew` - Renew lease
- `POST /api/leases/[id]/terminate` - Terminate lease

#### Tenants
- `GET /api/tenants` - List property tenants
- `POST /api/tenants` - Create tenant
- `GET /api/tenants/[id]` - Get tenant details
- `PATCH /api/tenants/[id]` - Update tenant
- `DELETE /api/tenants/[id]` - Delete tenant
- `POST /api/tenants/[id]/background-check` - Request background check

#### Maintenance
- `GET /api/maintenance` - List maintenance requests
- `POST /api/maintenance` - Create maintenance request
- `GET /api/maintenance/[id]` - Get request details
- `PATCH /api/maintenance/[id]` - Update request
- `DELETE /api/maintenance/[id]` - Delete request
- `POST /api/maintenance/[id]/assign` - Assign to staff/vendor
- `POST /api/maintenance/[id]/complete` - Mark as completed

#### Payments
- `GET /api/payments` - List payments
- `POST /api/payments` - Record payment
- `GET /api/payments/[id]` - Get payment details
- `POST /api/payments/initiate` - Initiate online payment
- `POST /api/payments/webhook` - Payment gateway webhook

#### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/[id]` - Get invoice details
- `PATCH /api/invoices/[id]` - Update invoice
- `GET /api/invoices/[id]/pdf` - Generate PDF

#### Subscription Management
- `GET /api/subscription/plans` - List all plans
- `POST /api/subscription/select` - Select/change plan
- `GET /api/subscription/limits` - Get limits and usage
- `GET /api/subscription/billing` - Get billing info

#### Custom Domain
- `POST /api/domain/request` - Request custom domain
- `POST /api/domain/verify` - Verify DNS configuration
- `GET /api/domain/status` - List domains
- `DELETE /api/domain/status?domainId=xxx` - Remove domain

#### Calendar
- `GET /api/calendar/events` - Get calendar events
- `POST /api/calendar/events` - Create calendar event

#### Reports
- `GET /api/reports/dashboard` - Dashboard metrics
- `GET /api/reports/revenue` - Revenue report
- `GET /api/reports/occupancy` - Occupancy report
- `GET /api/reports/maintenance` - Maintenance report
- `GET /api/reports/export` - Export data (CSV/PDF)

#### Super Admin
- `GET /api/superadmin/tenants` - List all tenants
- `GET /api/superadmin/tenants/[id]` - Get tenant details
- `PATCH /api/superadmin/tenants/[id]` - Update tenant
- `DELETE /api/superadmin/tenants/[id]` - Delete tenant
- `GET /api/superadmin/tenants/[id]/users` - List tenant users
- `GET /api/superadmin/tenants/[id]/properties` - List tenant properties
- `GET /api/superadmin/tenants/[id]/leases` - List tenant leases
- `GET /api/superadmin/tenants/[id]/subscription` - Get subscription
- `POST /api/superadmin/tenants/[id]/subscription` - Update subscription
- `PATCH /api/superadmin/users/[id]` - Manage user (verify, reset, impersonate)
- `GET /api/superadmin/analytics` - Platform analytics

#### Tenant Portal (Customer-facing)
- `GET /api/tenant-portal/dashboard` - Tenant dashboard
- `GET /api/tenant-portal/lease` - Current lease details
- `GET /api/tenant-portal/payments` - Payment history
- `POST /api/tenant-portal/payments` - Submit payment
- `GET /api/tenant-portal/maintenance` - Maintenance requests
- `POST /api/tenant-portal/maintenance` - Create request
- `PATCH /api/tenant-portal/profile` - Update profile

---

## UI/UX Requirements

### Design System
- **Color Palette**: Customizable per tenant with defaults
- **Typography**: Modern, readable font stack (Inter, SF Pro, system fonts)
- **Components**: Consistent component library (buttons, inputs, cards, modals)
- **Icons**: Lucide React for consistent iconography
- **Spacing**: 4px base unit with 8px increments
- **Responsive**: Mobile-first design with breakpoints (sm, md, lg, xl, 2xl)
- **Dark Mode**: Optional dark mode support

### Key UI Components
- **Property Card**: Image, title, price, bedrooms, bathrooms, location
- **Lease Card**: Tenant name, property, dates, status, rent amount
- **Maintenance Card**: Title, priority, status, property, assigned to
- **Payment Card**: Amount, date, method, status, receipt link
- **Dashboard Widget**: Metric cards with icons and trend indicators
- **Data Table**: Sortable, filterable tables with pagination
- **Calendar**: Multi-view calendar with event details
- **Modal**: Consistent modal design for forms and confirmations
- **Toast Notifications**: Success, error, warning, info messages
- **Loading States**: Skeleton loaders and spinners
- **Empty States**: Helpful empty state messages with CTAs

### Page Layouts
- **Public Pages**: Clean, minimal header with tenant branding
- **Admin Dashboard**: Sidebar navigation with collapsible menu
- **Tenant Portal**: Simplified sidebar with tenant-focused features
- **Super Admin**: Distinct admin theme with platform-level navigation

---

## Security & Compliance

### Security Measures
- **Data Encryption**: Encrypt sensitive data at rest and in transit
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **XSS Protection**: Input sanitization and output encoding
- **CSRF Protection**: Token-based CSRF protection
- **Rate Limiting**: API rate limiting to prevent abuse
- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Security**: Short-lived tokens with refresh mechanism
- **Tenant Isolation**: All queries filtered by tenantId
- **Audit Logging**: Track all critical actions with user, IP, timestamp

### Compliance Features
- **Data Privacy**: GDPR-compliant data handling
- **Data Export**: Allow users to export their data
- **Data Deletion**: Cascade delete for tenant data removal
- **Audit Trail**: Complete audit log for compliance
- **Access Control**: Fine-grained RBAC system
- **Session Management**: Secure session handling with expiration

---

## Deployment & DevOps

### Deployment Strategy
- **Platform**: Vercel (recommended) or similar serverless platform
- **Database**: Neon PostgreSQL with connection pooling
- **Storage**: Cloud storage for images and documents (S3, Cloudflare R2)
- **CDN**: Edge caching for static assets
- **Email**: SendGrid or Resend for transactional emails
- **Monitoring**: Error tracking and performance monitoring
- **Backups**: Automated database backups

### Environment Configuration
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Application
NEXT_PUBLIC_APP_URL="https://yourapp.com"
NEXT_PUBLIC_APP_DOMAIN="yourapp.com"
JWT_SECRET="your-secret-key"

# Super Admin
SUPER_ADMIN_EMAIL="admin@yourapp.com"
SUPER_ADMIN_PASSWORD="secure-password"

# Email
EMAIL_HOST="smtp.sendgrid.net"
EMAIL_PORT="587"
EMAIL_USER="apikey"
EMAIL_PASS="your-api-key"
EMAIL_FROM="Property Manager <noreply@yourapp.com>"

# Payment
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."

# Storage (Optional)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="property-rental"

# Cron (for scheduled tasks)
CRON_SECRET="your-cron-secret"
```

### Database Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed subscription plans
npx tsx prisma/seed-plans.ts

# Seed super admin (optional)
npx tsx prisma/seed-superadmin.ts
```

---

## Implementation Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup with Next.js 14, TypeScript, Tailwind
- [ ] Database schema design and Prisma setup
- [ ] Authentication system (register, login, JWT)
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Multi-tenant middleware
- [ ] Basic RBAC system

### Phase 2: Core Features (Week 3-4)
- [ ] Property management (CRUD)
- [ ] Property categories
- [ ] Property search and filtering
- [ ] Lease management (CRUD)
- [ ] Tenant management (CRUD)
- [ ] Payment tracking
- [ ] Invoice generation
- [ ] Admin dashboard with metrics

### Phase 3: Advanced Features (Week 5-6)
- [ ] Maintenance request system
- [ ] Calendar with multiple views
- [ ] Tenant portal
- [ ] Email notification system
- [ ] Document management
- [ ] Multi-office support
- [ ] Custom branding

### Phase 4: SaaS Features (Week 7-8)
- [ ] Subscription plan system
- [ ] Feature gating
- [ ] Usage enforcement
- [ ] Custom domain support
- [ ] Billing dashboard
- [ ] Upgrade/downgrade flows
- [ ] Super admin panel

### Phase 5: Polish & Launch (Week 9-10)
- [ ] Advanced analytics
- [ ] Report generation
- [ ] Export functionality
- [ ] Performance optimization
- [ ] Security audit
- [ ] Testing (unit, integration, E2E)
- [ ] Documentation
- [ ] Deployment

---

## Testing Requirements

### Unit Tests
- Authentication utilities
- Permission checking functions
- Date calculations
- Price calculations
- Validation schemas

### Integration Tests
- API endpoints
- Database operations
- Email sending
- Payment processing
- Feature gates

### E2E Tests
- User registration and login
- Property creation and search
- Lease creation and management
- Payment submission
- Maintenance request flow
- Tenant portal navigation

---

## Documentation Requirements

### Technical Documentation
- Architecture overview
- Database schema documentation
- API documentation with examples
- RBAC implementation guide
- Deployment guide
- Environment variable reference

### User Documentation
- Admin user guide
- Tenant portal guide
- Property manager guide
- Leasing agent guide
- Super admin guide
- FAQ and troubleshooting

---

## Success Criteria

### Functional Requirements
- ✅ Multi-tenant architecture with complete data isolation
- ✅ Three-tier subscription system with feature gating
- ✅ Complete property management lifecycle
- ✅ Lease management with status workflow
- ✅ Tenant portal with payment and maintenance
- ✅ Email notification system
- ✅ Role-based access control
- ✅ Custom domain support
- ✅ Super admin panel
- ✅ Responsive design for all devices

### Performance Requirements
- Page load time < 2 seconds
- API response time < 500ms
- Support 1000+ concurrent users
- Database query optimization
- Image optimization
- Edge caching for static assets

### Security Requirements
- Secure authentication and authorization
- Data encryption at rest and in transit
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Audit logging

---

## Future Enhancements

### Phase 2 Features
- Mobile apps (iOS/Android)
- E-signature integration
- Automated lease renewals
- Tenant screening API integration
- Accounting software integration (QuickBooks, Xero)
- SMS notifications
- Vendor management
- Recurring maintenance schedules
- Property inspection checklists
- Move-in/move-out inspection reports
- Tenant communication portal
- Online lease signing
- Automated late fee calculation
- Rent increase automation
- Tenant insurance tracking
- Utility management
- Key tracking system
- Parking management
- Package delivery tracking
- Community features (tenant directory, events)

### Advanced Features
- AI-powered rent pricing recommendations
- Predictive maintenance
- Chatbot for tenant inquiries
- Virtual property tours
- 3D floor plans
- IoT device integration (smart locks, thermostats)
- Tenant satisfaction surveys
- Market analysis tools
- Competitive pricing analysis
- Automated marketing campaigns
- Lead management CRM
- Showing scheduler
- Application screening automation
- Lease comparison tools
- Portfolio analysis
- Investment property calculator

---

## Notes for AI Implementation

### Code Quality Standards
- Use TypeScript for type safety
- Follow Next.js 14 App Router conventions
- Use Server Components by default, Client Components when needed
- Implement proper error handling with try-catch
- Use Zod for runtime validation
- Follow consistent naming conventions (camelCase for variables, PascalCase for components)
- Add JSDoc comments for complex functions
- Use async/await instead of promises chains
- Implement proper loading and error states
- Use Next.js Image component for images

### Best Practices
- Implement optimistic UI updates where appropriate
- Use React Server Components for data fetching
- Implement proper caching strategies
- Use middleware for authentication and tenant resolution
- Implement proper database indexes for performance
- Use transactions for multi-step operations
- Implement proper error boundaries
- Use environment variables for configuration
- Implement proper logging (development vs production)
- Follow accessibility guidelines (WCAG 2.1)

### Security Best Practices
- Never expose sensitive data in client components
- Validate all user inputs on server side
- Use parameterized queries (Prisma handles this)
- Implement rate limiting on sensitive endpoints
- Use HTTPS in production
- Implement proper CORS policies
- Sanitize user-generated content
- Use secure session management
- Implement proper password policies
- Log security-relevant events

### Performance Optimization
- Use Next.js Image optimization
- Implement proper caching headers
- Use database connection pooling
- Implement pagination for large datasets
- Use lazy loading for images and components
- Minimize bundle size with code splitting
- Use CDN for static assets
- Implement proper database indexes
- Use React.memo for expensive components
- Debounce search inputs

---

## Conclusion

This comprehensive prompt provides a complete blueprint for building a production-ready property rental SaaS platform. The system should be scalable, secure, and feature-rich, with a focus on multi-tenancy, role-based access control, and subscription management.

The implementation should follow modern web development best practices, use type-safe code throughout, and provide an excellent user experience for both property managers and tenants.

All features should be implemented with proper error handling, loading states, and user feedback. The system should be thoroughly tested and documented before deployment.
