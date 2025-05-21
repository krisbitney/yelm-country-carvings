import SMTP2GOApi from 'smtp2go-nodejs';
import { organizerEmail, smtpSenderEmail } from 'frontend/src/constants';

// Initialize SMTP2GO with API key
const smtp2go = SMTP2GOApi(process.env.SMTP2GO_API_KEY || '');

// Log API key for debugging (redacted for security)
console.log(
  'SMTP2GO API Key configured:',
  process.env.SMTP2GO_API_KEY ? 'API key is set' : 'API key is missing'
);

// Class for handling file attachments
class SimpleAttachment {
  filename: string;
  fileblob: string;
  mimetype: string;

  constructor(filename: string, fileblob: string, mimetype: string) {
    this.filename = filename;
    this.fileblob = fileblob;
    this.mimetype = mimetype;
  }

  // This method is required by the SMTP2GO library
  async readFileBlob(): Promise<this> {
    return this;
  }
}

export const handleContactForm = async (req: Request) => {
  try {
    // Parse form data
    const formData = await req.formData();
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || 'Not provided';
    const message = formData.get('message')?.toString() || '';
    const file = formData.get('file') as File | null;

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Prepare email content
    const emailContent = `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `;

    // Send email using SMTP2GO
    console.log('Preparing to send email from:', smtpSenderEmail, 'to:', organizerEmail);

    const mailService = smtp2go
      .mail()
      .from({
        name: 'Yelm Country Carvings Website',
        email: smtpSenderEmail,
      })
      .to({
        name: 'Yelm Country Carvings',
        email: organizerEmail,
      })
      .subject(`Contact Form Submission from ${name}`)
      .html(emailContent);

    // Handle potential file attachment
    if (file && file instanceof File && file.size > 0) {
      try {
        const filename = file.name;
        const mimetype = file.type;
        const arrayBuffer = await file.arrayBuffer();
        // Convert ArrayBuffer to base64 string
        const fileblob = Buffer.from(arrayBuffer).toString('base64');
        // Add attachment to the mail service
        mailService.attach(new SimpleAttachment(filename, fileblob, mimetype));
      } catch (attachError) {
        console.error('Error processing attachment:', attachError);
      }
    }

    try {
      console.log('Attempting to send email...');

      // Send the email using the SMTP2GO client
      const result = await smtp2go.client().consume(mailService);

      // Log the result for debugging
      console.log('Email sent successfully. SMTP2GO response:', JSON.stringify(result));

      return Response.json({
        success: true,
        message: 'Your message has been sent successfully!',
      });
    } catch (e) {
      const sendError = e as Error;
      console.error('Error sending email with SMTP2GO:', sendError);

      // Check if the error is related to the API key
      if (sendError.message && sendError.message.includes('api key')) {
        console.error('API key issue detected. Please verify your SMTP2GO API key.');
      }

      // Check if the error is related to the sender email
      if (sendError.message && sendError.message.includes('sender')) {
        console.error(
          'Sender email issue detected. Please verify your sender email is authorized in SMTP2GO.'
        );
      }

      throw sendError; // Re-throw to be caught by the outer try-catch
    }
  } catch (e) {
    const error = e as Error;
    console.error('Error in contact form handler:', error);

    // Provide a more detailed error message in development
    const errorMessage =
      process.env.NODE_ENV === 'development'
        ? `Failed to send message: ${error.message}`
        : 'Failed to send message. Please try again later.';

    return Response.json({ success: false, message: errorMessage }, { status: 500 });
  }
};
