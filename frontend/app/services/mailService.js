
// root/frontend/app/services/mailService.js
import fetchWithTimeout from '../utils/fetchWithTimeout';


// const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
// const SENDGRID_BASE_URL = 'https://api.sendgrid.com/v3/mail/send';



const mailService = {
    // async sendEmail(emailData) {
    //     const response = await fetchWithTimeout(`${BASE_URL}/route`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(emailData),
    //     });
    //     if (!response.ok) {
    //     throw new Error('Error sending email');
    //     }
    //     return await response.json();
    // },

    async sendEmailWithSendgrid({ to, from, subject, text, html }) {
      try {
        const response = await fetchWithTimeout('/api/sendEmail/route', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ to, from, subject, text, html }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Failed to send email');
        }

        console.log('Email sent successfully via API route');
        return { success: true, message: 'Email sent successfully via API route' };
      } catch (error) {
        console.error('Error sending email via API route:', error.toString());
        return { success: false, message: error.message || 'Error sending email via API route' };
      }
    }
    };


// how to use Mail service
  //handle booking appointment
  //   const handleBookingAppointment = async (hasAttendees , id) => {
  //     if (hasAttendees) {
  //         alert('This session has already been booked');
  //         return;
  //     } else {
  //         if (!confirm('Are you sure you want to book this session?')) {
  //             return;
  //         }
  //         const sessionDetails = {
  //             ...filteredSessionsDetails[id],
  //             title: 'Booked Session for ' + user.name,
  //             content: 'Booked Session for ' + user.name, 
  //             attendeeId: user.uid,};
  //             try {
  //                 await scheduleService.updateSession(id, sessionDetails);
  //                 // Assuming `user.email` contains the user's email address
  //                 await mailService.sendEmailWithSendgrid({
  //                     to: user.email, // The user's email
  //                     from: 'duchoang@duchoang.dev', // Your SendGrid verified sender email
  //                     subject: 'Session Booking Confirmation',
  //                     text: `Hi ${user.name}, you have successfully booked the session titled "${sessionDetails.title}" for ${new Date(sessionDetails.startTime).toLocaleString()}.`,
  //                     html: `<strong>Hi ${user.name},</strong><p>You have successfully booked the session titled "${sessionDetails.title}" for ${new Date(sessionDetails.startTime).toLocaleString()}.</p>`,
  //                 });
  //                 setRefreshCount(refreshCount + 1);
  //                 alert('Session booked successfully');
  //             } catch (error) {
  //                 console.error('Failed to book session or send confirmation email:', error);
  //                 alert('Failed to book the session or send confirmation email. Please try again.');
  //             }
  //     }
  // };
export default mailService;

