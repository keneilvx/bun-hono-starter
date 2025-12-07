import { Resend } from 'resend';
import logger from '../config/logger';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_KEY);

// Log initialization
logger.info('Resend email service initialized');

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send an email using Resend API
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const { to, subject, html, from = process.env.EMAIL_FROM || 'noreply@hymnverse.com' } = options;
    
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    
    if (error) {
      logger.error(`Failed to send email: ${error.message}`);
      return false;
    }
    
    logger.info(`Email sent with Resend: ${data?.id}`);
    return true;
  } catch (error: any) {
    logger.error(`Failed to send email: ${error.message}`);
    return false;
  }
}

/**
 * Generate and send a password reset email
 */
export async function sendPasswordResetEmail(
  email: string, 
  resetToken: string,
  userName: string = ''
): Promise<boolean> {
  // Use localhost:3000 for development or the configured frontend URL
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
  
  // Log the reset URL for debugging
  logger.info(`Generated reset URL: ${resetUrl} with token: ${resetToken}`);
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Reset Your Hymnverse Password</title>
      <style type="text/css">
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
        @media screen and (max-width: 525px) { .wrapper { width: 100% !important; max-width: 100% !important; } }
        @media screen and (max-width: 525px) { .responsive-table { width: 100% !important; } }
        @media screen and (max-width: 525px) { .padding { padding: 10px 5% 15px 5% !important; } }
        @media screen and (max-width: 525px) { .section-padding { padding: 0 15px 50px 15px !important; } }
      </style>
    </head>
    <body style="margin: 0 !important; padding: 0 !important; background-color: #f6f9fc;">
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Reset your Hymnverse password
      </div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 500px;">
        <tr>
          <td bgcolor="#f6f9fc" align="center" style="padding: 10px 15px 30px 15px;" class="section-padding">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px;" class="responsive-table">
              <tr>
                <td>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="center" style="padding: 25px 0 0 0; font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333; font-weight: bold;" class="padding">
                              <img src="https://i.imgur.com/bTTGZUt.png" width="80" height="90" style="display: block; color: #4f46e5;" alt="Hymnverse Logo">
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#f6f9fc" align="center" style="padding: 0 15px 0 15px;" class="section-padding">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px;" class="responsive-table">
              <tr>
                <td bgcolor="#ffffff" style="border-radius: 8px; padding: 40px;" class="padding">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td align="center" style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #333333; padding-top: 0;" class="padding">
                        <div style="color: #4f46e5; font-weight: bold;">Reset Your Password</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding">
                        Hello ${userName || email},
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding">
                        We received a request to reset your password for your Hymnverse account. If you didn't make this request, you can safely ignore this email.
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding">
                        To reset your password, click the button below:
                      </td>
                    </tr>
                    <tr>
                      <td align="center">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td align="center" style="padding: 30px 0 0 0;" class="padding">
                              <table border="0" cellspacing="0" cellpadding="0" class="mobile-button-container">
                                <tr>
                                  <td align="center" style="border-radius: 8px;" bgcolor="#4f46e5">
                                    <a href="${resetUrl}" target="_blank" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 8px; padding: 15px 25px; border: 1px solid #4f46e5; display: inline-block;" class="mobile-button">Reset Password</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding: 30px 0 0 0; font-size: 14px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding">
                        Or copy and paste this link into your browser:
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding: 5px 0 0 0; font-size: 14px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #4f46e5; word-break: break-all;" class="padding">
                        ${resetUrl}
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding: 30px 0 0 0; font-size: 14px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding">
                        This link will expire in 1 hour for security reasons.
                      </td>
                    </tr>
                    <tr>
                      <td align="left" style="padding: 30px 0 0 0; font-size: 14px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding">
                        Thank you,<br>The Hymnverse Team
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td bgcolor="#f6f9fc" align="center" style="padding: 20px 0px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 500px;" class="responsive-table">
              <tr>
                <td align="center" style="font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color:#666666;">
                  <span class="apple-footer">Hymnverse - Your Digital Hymnal Companion</span><br>
                  <a href="${process.env.FRONTEND_URL || 'https://hymnverse.com'}" target="_blank" style="color: #666666; text-decoration: none;">hymnverse.com</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject: 'Reset Your Hymnverse Password',
    html,
  });
}
