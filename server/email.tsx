import nodemailer from "nodemailer"
import { SMTP_CONFIG, SENDER_EMAIL, APP_URL } from "./config"

const transporter = nodemailer.createTransport(SMTP_CONFIG)

export async function sendVerificationEmail(email: string, token: string, firstName: string) {
  const verificationUrl = `${APP_URL}/verify?token=${token}`

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
          <h1>Tesla Investment Platform</h1>
        </div>
        <div class="content">
          <p>Hi ${firstName},</p>
          <p>Thank you for registering with Tesla Investment Platform! To complete your registration, please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
          <p>If you did not create this account, please ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
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
    subject: "Verify Your Tesla Investment Platform Account",
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
