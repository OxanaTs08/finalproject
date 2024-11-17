import nodemailer, { TransportOptions } from "nodemailer";

export const sendEmail = async ({
  from,
  to,
  subject,
  html,
}: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_SITE,
      pass: process.env.EMAIL_PASS,
    },
  } as TransportOptions);

  await transporter.sendMail({
    from: process.env.EMAIL_SITE,
    to,
    subject,
    html,
  });
};
