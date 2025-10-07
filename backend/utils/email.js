const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Email templates
const emailTemplates = {
    verification: (context) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Verify Your Email - MWG Hostels</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #667eea; color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; }
                .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to MWG Hostels!</h1>
                </div>
                <div class="content">
                    <h2>Hi ${context.firstName}!</h2>
                    <p>Thank you for registering with MWG Hostels. To complete your registration and start finding your perfect accommodation, please verify your email address.</p>
                    <p><strong>Student ID:</strong> ${context.studentId}</p>
                    <div style="text-align: center;">
                        <a href="${context.verificationUrl}" class="button">Verify Email Address</a>
                    </div>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 3px;">${context.verificationUrl}</p>
                    <p><strong>Note:</strong> This link will expire in 24 hours for security reasons.</p>
                </div>
                <div class="footer">
                    <p>© 2025 MWG Hostels by SAMA GREAT. All rights reserved.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
    `,
    
    passwordReset: (context) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Password Reset - MWG Hostels</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; }
                .button { background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <h2>Hi ${context.firstName}!</h2>
                    <p>We received a request to reset your password for your MWG Hostels account.</p>
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and consider changing your password immediately.
                    </div>
                    <p>To reset your password, click the button below:</p>
                    <div style="text-align: center;">
                        <a href="${context.resetUrl}" class="button">Reset Password</a>
                    </div>
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 3px;">${context.resetUrl}</p>
                    <p><strong>Important:</strong> This link will expire in ${context.expiryTime} for security reasons.</p>
                </div>
                <div class="footer">
                    <p>© 2025 MWG Hostels by SAMA GREAT. All rights reserved.</p>
                    <p>If you need help, contact us at support@mwghostels.com</p>
                </div>
            </div>
        </body>
        </html>
    `,
    
    welcome: (context) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Welcome to MWG Hostels!</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #28a745; color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; }
                .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 5px; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
                .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to MWG Hostels!</h1>
                </div>
                <div class="content">
                    <h2>Hi ${context.firstName}!</h2>
                    <p>Congratulations! Your account has been successfully verified and you're now part of the MWG Hostels community.</p>
                    
                    <h3>What you can do now:</h3>
                    <div class="feature">
                        <strong>🏠 Browse Verified Hostels</strong><br>
                        Explore hundreds of verified accommodations near FUTA campus gates.
                    </div>
                    <div class="feature">
                        <strong>👥 Find Compatible Roommates</strong><br>
                        Connect with fellow students who share your lifestyle and preferences.
                    </div>
                    <div class="feature">
                        <strong>💬 Secure Messaging</strong><br>
                        Communicate safely with property owners and potential roommates.
                    </div>
                    <div class="feature">
                        <strong>⭐ Reviews & Ratings</strong><br>
                        Read honest reviews from verified students and share your experiences.
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${context.platformUrl}" class="button">Start Exploring</a>
                        <a href="${context.profileUrl}" class="button">Complete Your Profile</a>
                    </div>
                    
                    <p><strong>💡 Pro Tip:</strong> Complete your profile with preferences and photos to get better roommate matches!</p>
                </div>
                <div class="footer">
                    <p>© 2025 MWG Hostels by SAMA GREAT. All rights reserved.</p>
                    <p>Need help getting started? Contact us at support@mwghostels.com</p>
                </div>
            </div>
        </body>
        </html>
    `
};

// Send email function
const sendEmail = async (options) => {
    try {
        const transporter = createTransporter();
        
        let html;
        if (options.template && emailTemplates[options.template]) {
            html = emailTemplates[options.template](options.context || {});
        } else {
            html = options.html || options.text;
        }
        
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: html
        };
        
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully:', {
            to: options.to,
            subject: options.subject,
            messageId: info.messageId
        });
        
        return {
            success: true,
            messageId: info.messageId
        };
        
    } catch (error) {
        console.error('Email sending failed:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

// Send bulk emails
const sendBulkEmail = async (recipients, template, context = {}) => {
    try {
        const results = [];
        
        for (const recipient of recipients) {
            try {
                const result = await sendEmail({
                    to: recipient.email,
                    subject: context.subject,
                    template: template,
                    context: { ...context, ...recipient }
                });
                
                results.push({
                    email: recipient.email,
                    success: true,
                    messageId: result.messageId
                });
                
            } catch (error) {
                results.push({
                    email: recipient.email,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return results;
        
    } catch (error) {
        console.error('Bulk email sending failed:', error);
        throw error;
    }
};

// Test email configuration
const testEmailConfig = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        
        console.log('✅ Email configuration is valid');
        return true;
        
    } catch (error) {
        console.error('❌ Email configuration error:', error.message);
        return false;
    }
};

module.exports = {
    sendEmail,
    sendBulkEmail,
    testEmailConfig,
    emailTemplates
};