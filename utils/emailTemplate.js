import { mailTransport } from "./mail.js";

//Resolved merge conflicts in authControllers.js and emailTemplate.js

const centeredEmailTemplate = (title, content) => `
  <div style="background-color: #f4f4f4; padding: 30px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center" valign="middle">
          <table role="presentation" width="600px" cellspacing="0" cellpadding="20" border="0" 
            style="background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
            <tr>
              <td align="center">
                <h2 style="color: #007bff;">${title}</h2>
                ${content}
                <hr style="border: none; border-top: 1px solid #ddd;">
                <p style="text-align: center; font-size: 14px; color: #999;">&copy; ${new Date().getFullYear()} NoteWorthy Team. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`;

export const sendVerificationEmail = async (newuser, OTP) => {
  try {
    await mailTransport.sendMail({
      from: '"NoteWorthy" <no-reply@noteWorthy.com>',
      to: newuser.email,
      subject: "Email Verification - NoteWorthy",
      html: centeredEmailTemplate("NoteWorthy Email Verification", `
        <p style="font-size: 16px;">Hello <strong>${newuser.userName}</strong>,</p>
        <p style="font-size: 16px;">Use the following OTP to verify your email:</p>
        <div style="text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; color: #007bff;">${OTP}</div>
        <p style="font-size: 14px; color: #666;">This OTP is valid for 10 minutes.</p>
      `),
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const sendForgotPasswordEmail = async (user, generateToken) => {
  try {
    await mailTransport.sendMail({
      from: '"NoteWorthy Security" <no-reply@noteWorthy.com>',
      to: user.email,
      subject: "Reset Your Password - NoteWorthy",
      html: centeredEmailTemplate("Password Reset Request", `
        <p>Hello <strong>${user.userName}</strong>,</p>
        <p>Click below to reset your password:</p>
        <div style="text-align: center; margin: 20px 0;">

          <a href="${process.env.FRONTEND_URL}/auth/resetPassword?token=${generateToken}&id=${user._id}" 

             style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
             Reset Password
          </a>
        </div>
      `),
    });
  } catch (error) {
    console.error("Error sending forgot password email:", error);
  }
};

export const sendPasswordResetSuccessEmail = async (user) => {
  try {
    await mailTransport.sendMail({
      from: '"NoteWorthy Security" <no-reply@noteWorthy.com>',
      to: user.email,
      subject: "Your Password Has Been Successfully Reset",
      html: centeredEmailTemplate("Password Reset Successful ✅", `
        <p>Hello <strong>${user.userName}</strong>,</p>
        <p>Your password has been changed successfully.</p>
        <div style="text-align: center; margin: 20px 0;">

          <a href="${process.env.FRONTEND_URL}/auth/login" 

             style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
             Login Now
          </a>
        </div>
      `),
    });
  } catch (error) {
    console.error("Error sending password reset success email:", error);
  }
};

export const sendVerificationEmailMsg = async (user) => {
  try {
    await mailTransport.sendMail({
      from: '"NoteWorthy Support" <no-reply@noteWorthy.com>',
      to: user.email,
      subject: "Your Email Has Been Verified Successfully",
      html: centeredEmailTemplate("Email Verification Successful 🎉", `
        <p>Hello <strong>${user.userName}</strong>,</p>
        <p>Congratulations! Your email has been successfully verified.</p>
      `),
    });
  } catch (error) {
    console.error("Error sending verification email message:", error);
  }
};


export const sendRejectedTeacherEmail = async (user) => {
  try {
    await mailTransport.sendMail({
      from: '"NoteWorthy Team" <no-reply@noteWorthy.com>',
      to: user.email,
      subject: "Application Rejected - NoteWorthy",
      html: centeredEmailTemplate("Teacher Registration Rejected", `
        <p>Hello <strong>${user.userName}</strong>,</p>
        <p>We regret to inform you that your application to join NoteWorthy as a teacher has been <strong>rejected</strong>.</p>
        <p>If you believe this is a mistake or would like more information, please contact the department for clarification.</p>
        <p>You can reach out to us at: <a href="mailto:support@noteworthy.com">support@noteworthy.com</a></p>
        <br/>
        <p>Thank you for your interest in NoteWorthy.</p>
      `),
    });
  } catch (error) {
    console.error("Error sending rejected teacher email:", error);
  }
};


export const sendApprovedTeacherEmail = async (user) => {
  try {
    await mailTransport.sendMail({
      from: '"NoteWorthy Team" <no-reply@noteWorthy.com>',
      to: user.email,
      subject: "Application Approved - NoteWorthy",
      html: centeredEmailTemplate("Congratulations! You've Been Approved 🎉", `
        <p>Hello <strong>${user.userName}</strong>,</p>
        <p>We're excited to inform you that your application to join <strong>NoteWorthy</strong> as a teacher has been <strong>approved</strong>.</p>
        <p>You can now log in to your account and start contributing to the platform.</p>
        <br/>


        <p><a href="${process.env.FRONTEND_URL}/auth/login" style="color: #1d4ed8; font-weight: bold;">Click here to log in</a></p>

        <br/>
        <p>If you have any questions, feel free to contact us at: <a href="mailto:support@noteworthy.com">support@noteworthy.com</a></p>
        <br/>
        <p>Welcome aboard!</p>
        <p>– The NoteWorthy Team</p>
      `),
    });
  } catch (error) {
    console.error("Error sending approved teacher email:", error);
  }
};


export const sendContactMessage = async ({ name, email, message }) => {
  try {
    await mailTransport.sendMail({
      from: `"NoteWorthy Contact" <${email}>`,
      to: 'ha698174@gmail.com', 
      subject: `New Contact Message from ${name}`,
      html: centeredEmailTemplate("📩 New Contact Message", `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `),
    });
    console.log("📨 Contact message sent successfully!");
  } catch (error) {
    console.error("❌ Error sending contact message:", error);
  }
};


export const sendRestoredAccountEmail = async (user) => {
  try {
    await mailTransport.sendMail({
      from: '"NoteWorthy Team" <no-reply@noteworthy.com>',
      to: user.email,
      subject: "Account Restored - NoteWorthy",
      html: centeredEmailTemplate("Your Account Has Been Restored 🎉", `
        <p>Hello <strong>${user.userName}</strong>,</p>
        <p>We're happy to inform you that your <strong>NoteWorthy</strong> account has been successfully <strong>restored</strong>.</p>
        <p>To ensure your account's security, we recommend resetting your password.</p>
        <br/>
        <p><a href="${process.env.FRONTEND_URL}/auth/forgotPassword" style="color: #1d4ed8; font-weight: bold;">Click here to reset your password</a></p>
        <br/>
        <p>If you did not expect this restoration, please contact our support team immediately at: <a href="mailto:support@noteworthy.com">support@noteworthy.com</a></p>
        <br/>
        <p>Welcome back!</p>
        <p>– The NoteWorthy Team</p>
      `),
    });
  } catch (error) {
    console.error("Error sending restored account email:", error);
  }
};


export const sendDeletionWarningEmail = async (user) => {
  try {
    await mailTransport.sendMail({
      from: '"NoteWorthy Team" <no-reply@noteworthy.com>',
      to: user.email,
      subject: "Account Deletion Warning - 24 Hours Remaining",
      html: centeredEmailTemplate("Your Account is Scheduled for Deletion ⏳", `
        <p>Hello <strong>${user.userName}</strong>,</p>
        <p>This is a final reminder that your <strong>NoteWorthy</strong> account is scheduled to be permanently <strong>deleted in the next 24 hours</strong>.</p>
        <p>If you want to keep your account, simply log in before the 24-hour period ends. Doing so will automatically cancel the deletion process.</p>
        <br/>
        <p><a href="${process.env.FRONTEND_URL}/auth/login" style="color: #dc2626; font-weight: bold;">Click here to log in and restore your account</a></p>
        <br/>
        <p>If no action is taken, your data will be permanently erased and cannot be recovered.</p>
        <p>For any issues or questions, contact us at: <a href="mailto:support@noteworthy.com">support@noteworthy.com</a></p>
        <br/>
        <p>– The NoteWorthy Team</p>
      `),
    });
  } catch (error) {
    console.error("Error sending deletion warning email:", error);
  }
};
