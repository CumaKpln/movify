const nodemailer =require("nodemailer");
require("dotenv").config();

async function sendMail(verificationToken, recipientEmail) {
  const verificationLink = `http://localhost:3000/auth/verify/${verificationToken}`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Cuma Kaplan" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: "Mail Onayı ✔",
      text: `Lütfen mailinizi doğrulamak için bu linke tıklayın: ${verificationLink}`,
      html: `<p>Lütfen mailinizi doğrulamak için linke tıklayın:</p>
             <a href="${verificationLink}">Doğrula</a>`,
    });

    console.log("Mail gönderildi!");
  } catch (err) {
    console.error("Mail gönderilemedi:", err);
  }
}
module.exports = sendMail;
