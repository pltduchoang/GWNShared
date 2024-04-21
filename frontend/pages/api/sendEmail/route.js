//root/pages/api/newsletters/sendNewsletter/route.js




// this API route is currently in use for Mailgun
// import formData from 'form-data';
// import Mailgun from 'mailgun.js';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     // Initialize Mailgun client with formData
//     const mailgun = new Mailgun(formData);
//     const mg = mailgun.client({
//       username: 'api',
//       key: process.env.MAILGUN_API_KEY,
//     });

//     const { from, to, subject, html } = req.body;

//     try {
//       // Sending the email
//       const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
//         from,
//         to,
//         subject,
//         html,
//       });
//       res.status(200).json({ message: 'Email sent', data });
//     } catch (error) {
//         console.error('Mailgun error:', error);
//         if (error.response) {
//             console.error("Mailgun detailed error:", await error.response.json());
//         }
//         res.status(500).json({ error: 'Failed to send email', details: error.message });
//         }
//   } else {
//     // Handle any other HTTP method
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }


// this API route is currently in use for Sendgrid
// pages/api/sendNewsletter.js
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { to, from, subject, text, html } = req.body;

    try {
      await sgMail.send({ to, from, subject, text, html });
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error(error.toString());
      const errorMessage = error.response ? error.response.body.errors[0].message : 'Failed to send email';
      res.status(500).json({ success: false, message: errorMessage });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}