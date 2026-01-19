import nodemailer from 'nodemailer';

const isDevelopment = process.env.NODE_ENV === 'development';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (isDevelopment) {
      console.log('📧 Email (Development Mode):');
      console.log('To:', options.to);
      console.log('Subject:', options.subject);
      console.log('HTML:', options.html);
      return true;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Manage Midziyo <noreply@managemidziyo.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function getEmailTemplate(
  title: string,
  content: string,
  buttonText?: string,
  buttonUrl?: string,
  brandColor: string = '#3B82F6'
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="background-color: ${brandColor}; padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">${title}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 30px;">
                  <div style="color: #333333; font-size: 16px; line-height: 1.6;">
                    ${content}
                  </div>
                  ${
                    buttonText && buttonUrl
                      ? `
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="${buttonUrl}" style="display: inline-block; padding: 14px 30px; background-color: ${brandColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">${buttonText}</a>
                  </div>
                  `
                      : ''
                  }
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center; color: #666666; font-size: 14px;">
                  <p style="margin: 0;">This is an automated message from Manage Midziyo.</p>
                  <p style="margin: 10px 0 0 0;">Powering Smarter Property Operations</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  companyName: string,
  brandColor?: string
): Promise<boolean> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;
  
  const html = getEmailTemplate(
    'Verify Your Email',
    `
      <p>Welcome to ${companyName}!</p>
      <p>Please verify your email address by clicking the button below:</p>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">This link will expire in 24 hours.</p>
    `,
    'Verify Email',
    verificationUrl,
    brandColor
  );

  return sendEmail({
    to: email,
    subject: 'Verify Your Email Address',
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  brandColor?: string
): Promise<boolean> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  
  const html = getEmailTemplate(
    'Reset Your Password',
    `
      <p>You requested to reset your password.</p>
      <p>Click the button below to create a new password:</p>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">This link will expire in 1 hour.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    `,
    'Reset Password',
    resetUrl,
    brandColor
  );

  return sendEmail({
    to: email,
    subject: 'Reset Your Password',
    html,
  });
}

export async function sendWelcomeEmail(
  email: string,
  firstName: string,
  companyName: string,
  brandColor?: string
): Promise<boolean> {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
  
  const html = getEmailTemplate(
    'Welcome to Manage Midziyo',
    `
      <p>Hi ${firstName},</p>
      <p>Welcome to Manage Midziyo! Your account for ${companyName} has been successfully created.</p>
      <p>You can now start managing your properties, tenants, and leases all in one place.</p>
      <p>Get started by logging in to your dashboard:</p>
    `,
    'Go to Dashboard',
    dashboardUrl,
    brandColor
  );

  return sendEmail({
    to: email,
    subject: 'Welcome to Manage Midziyo',
    html,
  });
}

export async function sendLeaseApprovedEmail(
  email: string,
  tenantName: string,
  propertyName: string,
  startDate: string,
  brandColor?: string
): Promise<boolean> {
  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tenant-portal`;
  
  const html = getEmailTemplate(
    'Lease Approved',
    `
      <p>Hi ${tenantName},</p>
      <p>Great news! Your lease application for <strong>${propertyName}</strong> has been approved.</p>
      <p>Your lease will start on <strong>${startDate}</strong>.</p>
      <p>You can view your lease details and make payments through the tenant portal:</p>
    `,
    'View Lease',
    portalUrl,
    brandColor
  );

  return sendEmail({
    to: email,
    subject: 'Lease Application Approved',
    html,
  });
}

export async function sendRentDueReminderEmail(
  email: string,
  tenantName: string,
  amount: number,
  dueDate: string,
  daysUntilDue: number,
  brandColor?: string
): Promise<boolean> {
  const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tenant-portal/payments`;
  
  const html = getEmailTemplate(
    'Rent Payment Reminder',
    `
      <p>Hi ${tenantName},</p>
      <p>This is a friendly reminder that your rent payment of <strong>$${amount.toFixed(2)}</strong> is due ${daysUntilDue === 0 ? 'today' : `in ${daysUntilDue} day${daysUntilDue > 1 ? 's' : ''}`}.</p>
      <p>Due Date: <strong>${dueDate}</strong></p>
      <p>You can make your payment securely through the tenant portal:</p>
    `,
    'Pay Now',
    paymentUrl,
    brandColor
  );

  return sendEmail({
    to: email,
    subject: `Rent Due ${daysUntilDue === 0 ? 'Today' : `in ${daysUntilDue} Day${daysUntilDue > 1 ? 's' : ''}`}`,
    html,
  });
}

export async function sendMaintenanceUpdateEmail(
  email: string,
  tenantName: string,
  requestTitle: string,
  status: string,
  notes: string,
  brandColor?: string
): Promise<boolean> {
  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tenant-portal/maintenance`;
  
  const html = getEmailTemplate(
    'Maintenance Request Update',
    `
      <p>Hi ${tenantName},</p>
      <p>Your maintenance request "<strong>${requestTitle}</strong>" has been updated.</p>
      <p>Status: <strong>${status}</strong></p>
      ${notes ? `<p>Notes: ${notes}</p>` : ''}
      <p>You can view the full details in the tenant portal:</p>
    `,
    'View Request',
    portalUrl,
    brandColor
  );

  return sendEmail({
    to: email,
    subject: 'Maintenance Request Update',
    html,
  });
}
