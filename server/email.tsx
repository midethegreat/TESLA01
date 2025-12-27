import nodemailer from "nodemailer"
import { SMTP_CONFIG, SENDER_EMAIL, APP_URL } from "./config"

const transporter = nodemailer.createTransport(SMTP_CONFIG)

export async function sendVerificationEmail(
  email: string,
  code: string,
  firstName: string,
  type = "email_verification",
  reason?: string,
) {
  if (type === "kyc_approved") {
    return sendKYCApprovalEmail(email, firstName)
  }
  if (type === "kyc_rejected") {
    return sendKYCRejectionEmail(email, firstName, reason || "")
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 0; border-radius: 8px; }
        .header { background-color: #d32f2f; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 40px 30px; color: #333; }
        .code-box { 
          background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
          border: 2px dashed #d32f2f;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
        }
        .code { 
          font-size: 42px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #d32f2f;
          font-family: 'Courier New', monospace;
          margin: 10px 0;
        }
        .code-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding: 20px; }
        .warning { 
          background-color: #fff3cd; 
          border-left: 4px solid #ffc107; 
          padding: 15px; 
          margin: 20px 0;
          color: #856404;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">Tesla Investment Platform</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin-bottom: 10px;">Hi ${firstName},</p>
          <p style="font-size: 14px; line-height: 1.6;">Thank you for registering with Tesla Investment Platform! To complete your registration and verify your email address, please use the verification code below:</p>
          
          <div class="code-box">
            <div class="code-label">Your Verification Code</div>
            <div class="code">${code}</div>
          </div>

          <p style="font-size: 14px; line-height: 1.6;">Enter this code on the verification page to activate your account.</p>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> This code will expire in 15 minutes. Never share this code with anyone. Tesla Investment Platform will never ask for your verification code.
          </div>

          <p style="font-size: 13px; color: #666; margin-top: 30px;">If you did not create this account, please ignore this email or contact our support team.</p>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;">Tesla Investment Platform &copy; 2025. All rights reserved.</p>
          <p style="margin: 5px 0; color: #ccc;">This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: SENDER_EMAIL,
    to: email,
    subject: "Verify Your Tesla Investment Platform Account",
    html: htmlContent,
  })
}

export async function sendKYCApprovalEmail(email: string, firstName: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 0; border-radius: 8px; }
        .header { 
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: white; 
          padding: 40px 20px; 
          text-align: center; 
          border-radius: 8px 8px 0 0; 
        }
        .content { padding: 40px 30px; color: #333; }
        .success-badge {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          border: 3px solid #16a34a;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
        }
        .checkmark {
          width: 80px;
          height: 80px;
          background-color: #16a34a;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .success-text {
          font-size: 28px;
          font-weight: bold;
          color: #15803d;
          margin: 15px 0;
        }
        .button { 
          display: inline-block; 
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white; 
          padding: 16px 32px; 
          border-radius: 8px; 
          text-decoration: none; 
          margin: 20px 0;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .benefits {
          background-color: #f9fafb;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          margin: 12px 0;
          font-size: 14px;
        }
        .benefit-icon {
          color: #16a34a;
          margin-right: 10px;
          font-size: 18px;
        }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 32px;">🎉 Congratulations!</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin-bottom: 10px;">Hi ${firstName},</p>
          
          <div class="success-badge">
            <div class="checkmark">
              <span style="color: white; font-size: 48px;">✓</span>
            </div>
            <div class="success-text">KYC Verified!</div>
            <p style="color: #166534; font-size: 14px; margin-top: 10px;">Your identity has been successfully verified</p>
          </div>

          <p style="font-size: 14px; line-height: 1.8;">Great news! Your KYC (Know Your Customer) verification has been approved by our team. You now have full access to all platform features.</p>
          
          <div class="benefits">
            <h3 style="margin-top: 0; color: #111827; font-size: 16px;">What You Can Do Now:</h3>
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span>Make unlimited deposits and investments</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span>Withdraw funds to your wallet</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span>Access premium investment plans</span>
            </div>
            <div class="benefit-item">
              <span class="benefit-icon">✓</span>
              <span>Higher transaction limits</span>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}" class="button">Start Investing Now</a>
          </div>

          <p style="font-size: 13px; color: #666; margin-top: 30px; line-height: 1.6;">Thank you for choosing Tesla Investment Platform. We're committed to providing you with a secure and profitable investment experience.</p>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;">Tesla Investment Platform &copy; 2025. All rights reserved.</p>
          <p style="margin: 5px 0; color: #ccc;">This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: SENDER_EMAIL,
    to: email,
    subject: "🎉 Congratulations! Your KYC Has Been Approved",
    html: htmlContent,
  })
}

export async function sendKYCRejectionEmail(email: string, firstName: string, reason: string) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 0; border-radius: 8px; }
        .header { 
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white; 
          padding: 40px 20px; 
          text-align: center; 
          border-radius: 8px 8px 0 0; 
        }
        .content { padding: 40px 30px; color: #333; }
        .alert-box {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border: 3px solid #dc2626;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
        }
        .alert-icon {
          width: 80px;
          height: 80px;
          background-color: #dc2626;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .alert-text {
          font-size: 24px;
          font-weight: bold;
          color: #991b1b;
          margin: 15px 0;
        }
        .reason-box {
          background-color: #fff3cd;
          border-left: 4px solid #f59e0b;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .reason-label {
          font-size: 12px;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .reason-text {
          font-size: 14px;
          color: #78350f;
          line-height: 1.6;
        }
        .button { 
          display: inline-block; 
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
          color: white; 
          padding: 16px 32px; 
          border-radius: 8px; 
          text-decoration: none; 
          margin: 20px 0;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .tips {
          background-color: #f9fafb;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }
        .tip-item {
          display: flex;
          align-items: flex-start;
          margin: 12px 0;
          font-size: 14px;
        }
        .tip-icon {
          color: #f97316;
          margin-right: 10px;
          font-size: 18px;
          margin-top: 2px;
        }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">KYC Review Update</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin-bottom: 10px;">Hi ${firstName},</p>
          
          <div class="alert-box">
            <div class="alert-icon">
              <span style="color: white; font-size: 48px;">!</span>
            </div>
            <div class="alert-text">KYC Requires Resubmission</div>
            <p style="color: #7f1d1d; font-size: 14px; margin-top: 10px;">Please review and resubmit your documents</p>
          </div>

          <p style="font-size: 14px; line-height: 1.8;">Thank you for submitting your KYC documents. After careful review, we need you to resubmit your verification documents for the following reason:</p>
          
          <div class="reason-box">
            <div class="reason-label">Reason for Rejection:</div>
            <div class="reason-text">${reason}</div>
          </div>

          <div class="tips">
            <h3 style="margin-top: 0; color: #111827; font-size: 16px;">Tips for Successful Verification:</h3>
            <div class="tip-item">
              <span class="tip-icon">📸</span>
              <span>Ensure all images are clear and well-lit</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">📄</span>
              <span>All text on documents must be readable</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">✓</span>
              <span>Upload all required documents (Front, Back, Selfie)</span>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🔒</span>
              <span>Use valid government-issued identification</span>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${APP_URL}" class="button">Resubmit KYC Documents</a>
          </div>

          <p style="font-size: 13px; color: #666; margin-top: 30px; line-height: 1.6;">If you have any questions or need assistance, please contact our support team. We're here to help you complete the verification process.</p>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;">Tesla Investment Platform &copy; 2025. All rights reserved.</p>
          <p style="margin: 5px 0; color: #ccc;">This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: SENDER_EMAIL,
    to: email,
    subject: "KYC Verification - Action Required",
    html: htmlContent,
  })
}

export async function sendPasswordResetEmail(email: string, resetToken: string, firstName: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
        .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; color: #333; }
        .button { display: inline-block; background-color: #d32f2f; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin: 20px 0; }
        .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset</h1>
        </div>
        <div class="content">
          <p>Hi ${firstName},</p>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
        <div class="footer">
          <p>Tesla Investment Platform &copy; 2025. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: SENDER_EMAIL,
    to: email,
    subject: "Reset Your Password",
    html: htmlContent,
  })
}
