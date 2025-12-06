import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const mailSender = async (email, title, body) => {
  try {
    // Sending email using Resend
    const { data, error } = await resend.emails.send({
      from: `NexusCoding <${process.env.MAIL_SENDER}>`,
      to: email,
      subject: title,
      html: body,
    });

    if (error) {
      console.error("❌ Resend Email Error:", error);
      return error.message;
    }

    console.log("📧 Email sent successfully via Resend:", data);
    return data;
  } catch (error) {
    console.error("❌ ERROR SENDING EMAIL:", error.message);
    return error.message;
  }
};
