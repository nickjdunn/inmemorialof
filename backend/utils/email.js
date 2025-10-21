const nodemailer = require('nodemailer');
// EmailTemplate model will be created in Phase 4
// const EmailTemplate = require('../models/EmailTemplate');

// Create transporter (configured in admin settings)
let transporter = null;

const initializeTransporter = (config) => {
  transporter = nodemailer.createTransport({
    host: config.host || process.env.SMTP_HOST,
    port: config.port || process.env.SMTP_PORT,
    secure: config.secure || process.env.SMTP_SECURE === 'true',
    auth: {
      user: config.user || process.env.SMTP_USER,
      pass: config.pass || process.env.SMTP_PASS
    }
  });
};

// Initialize with default env config
initializeTransporter({});

// Get email template
const getTemplate = async (templateName, data) => {
  try {
    const template = await EmailTemplate.findOne({ name: templateName, active: true });
    
    if (template) {
      let content = template.content;
      Object.keys(data).forEach(key => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
      });
      return { subject: template.subject, html: content };
    }
    
    // Fallback to default templates
    return getDefaultTemplate(templateName, data);
  } catch (error) {
    console.error('Template error:', error);
    return getDefaultTemplate(templateName, data);
  }
};

// Default email templates
const getDefaultTemplate = (templateName, data) => {
  const templates = {
    'email-verification': {
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to InMemorialOf, ${data.name}!</h2>
          <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
          <a href="${data.verificationLink}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Verify Email</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #6B7280; word-break: break-all;">${data.verificationLink}</p>
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">If you didn't create an account, please ignore this email.</p>
        </div>
      `
    },
    'magic-link': {
      subject: 'Your Login Link',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.name},</h2>
          <p>Click the button below to log in to your account:</p>
          <a href="${data.magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Log In</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #6B7280; word-break: break-all;">${data.magicLink}</p>
          <p style="color: #DC2626; font-size: 14px;">This link expires in ${data.expiresIn} minutes and can be used ${data.maxUses} times.</p>
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    },
    'password-reset': {
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.name},</h2>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <a href="${data.resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #6B7280; word-break: break-all;">${data.resetLink}</p>
          <p style="color: #DC2626; font-size: 14px;">This link expires in 1 hour.</p>
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    },
    'tribute-notification': {
      subject: 'New Tribute Pending Approval',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${data.name},</h2>
          <p>A new tribute has been submitted for <strong>${data.memorialName}</strong>:</p>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${data.authorName}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          <a href="${data.approvalLink}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Review Tribute</a>
          <p style="color: #6B7280; font-size: 14px;">You'll need to log in to approve or reject this tribute.</p>
        </div>
      `
    },
    'purchase-confirmation': {
      subject: 'Purchase Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for your purchase, ${data.name}!</h2>
          <p>Your order has been confirmed. Here are the details:</p>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Package:</strong> ${data.packageName}</p>
            <p><strong>Memorial Slots:</strong> ${data.slots}</p>
            <p><strong>Amount Paid:</strong> $${data.amount}</p>
            <p><strong>Date:</strong> ${data.date}</p>
          </div>
          <a href="${data.dashboardLink}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Go to Dashboard</a>
          <p style="color: #6B7280; font-size: 14px;">Receipt attached to this email.</p>
        </div>
      `
    }
  };

  return templates[templateName] || {
    subject: 'Notification',
    html: `<p>${JSON.stringify(data)}</p>`
  };
};

// Send email function
exports.sendEmail = async ({ to, subject, template, data, attachments }) => {
  try {
    if (!transporter) {
      throw new Error('Email transporter not configured');
    }

    let emailContent;
    if (template) {
      emailContent = await getTemplate(template, data);
      subject = emailContent.subject;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@inmemorialof.com',
      to,
      subject,
      html: emailContent?.html || data.html,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Update transporter configuration (called from admin settings)
exports.updateTransporter = (config) => {
  initializeTransporter(config);
};

// Test email configuration
exports.testEmail = async (testEmail) => {
  try {
    await exports.sendEmail({
      to: testEmail,
      subject: 'Test Email - InMemorialOf',
      data: {
        html: '<h2>Email Configuration Test</h2><p>If you received this, your email settings are working correctly!</p>'
      }
    });
    return true;
  } catch (error) {
    console.error('Email test failed:', error);
    throw error;
  }
};