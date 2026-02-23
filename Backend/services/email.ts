import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (to: string, otp: string): Promise<void> => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Your FoodAdmin Login OTP",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e4e4e7;border-radius:8px">
        <h2 style="margin:0 0 8px;color:#18181b">FoodAdmin — One-Time Password</h2>
        <p style="color:#52525b;margin:0 0 24px">Use the code below to sign in. It expires in <strong>10 minutes</strong>.</p>
        <div style="background:#f4f4f5;border-radius:6px;padding:20px;text-align:center;letter-spacing:8px;font-size:32px;font-weight:700;color:#18181b">
          ${otp}
        </div>
        <p style="color:#a1a1aa;font-size:13px;margin:20px 0 0">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};
