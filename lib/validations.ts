import { z } from 'zod';

export const registerSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const propertySchema = z.object({
  name: z.string().min(2, 'Property name must be at least 2 characters'),
  description: z.string().optional(),
  propertyType: z.enum(['residential', 'commercial', 'vacation', 'mixed']),
  categoryId: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Zip code is required'),
  country: z.string().default('US'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  officeId: z.string().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  squareFeet: z.number().int().min(0).optional(),
  lotSize: z.number().min(0).optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear() + 1).optional(),
  amenities: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  baseRent: z.number().min(0, 'Base rent must be positive'),
  securityDeposit: z.number().min(0).optional(),
  currency: z.string().default('USD'),
  status: z.enum(['available', 'occupied', 'maintenance', 'unlisted']).default('available'),
  availableFrom: z.string().optional(),
  images: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  virtualTourUrl: z.string().url().optional().or(z.literal('')),
  utilitiesIncluded: z.array(z.string()).optional(),
  petPolicy: z.enum(['no_pets', 'cats_only', 'dogs_only', 'all_pets']).optional(),
  petDeposit: z.number().min(0).optional(),
  parkingSpaces: z.number().int().min(0).default(0),
  parkingFee: z.number().min(0).optional(),
});

export const leaseSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  propertyTenantId: z.string().min(1, 'Tenant is required'),
  coTenants: z.array(z.string()).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  leaseType: z.enum(['fixed', 'month_to_month', 'short_term']),
  monthlyRent: z.number().min(0, 'Monthly rent must be positive'),
  securityDeposit: z.number().min(0, 'Security deposit must be positive'),
  petDeposit: z.number().min(0).optional(),
  otherDeposits: z.array(z.object({
    name: z.string(),
    amount: z.number(),
  })).optional(),
  rentDueDay: z.number().int().min(1).max(31).default(1),
  lateFeeAmount: z.number().min(0).optional(),
  lateFeeDays: z.number().int().min(0).default(5),
  autoRenew: z.boolean().default(false),
  notes: z.string().optional(),
});

export const tenantSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  dateOfBirth: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  employer: z.string().optional(),
  occupation: z.string().optional(),
  annualIncome: z.number().min(0).optional(),
  idDocument: z.string().optional(),
  proofOfIncome: z.string().optional(),
});

export const maintenanceRequestSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'emergency']).default('medium'),
  propertyId: z.string().min(1, 'Property is required'),
  leaseId: z.string().optional(),
  scheduledDate: z.string().optional(),
  estimatedCost: z.number().min(0).optional(),
  images: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const paymentSchema = z.object({
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().default('USD'),
  paymentType: z.enum(['rent', 'deposit', 'late_fee', 'maintenance', 'other']),
  leaseId: z.string().optional(),
  invoiceId: z.string().optional(),
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'cash', 'check', 'stripe', 'other']),
  paymentProvider: z.string().optional(),
  transactionId: z.string().optional(),
  payerName: z.string().optional(),
  payerEmail: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const officeSchema = z.object({
  name: z.string().min(2, 'Office name must be at least 2 characters'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Zip code is required'),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  isPrimary: z.boolean().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  basePrice: z.number().min(0).optional(),
});
