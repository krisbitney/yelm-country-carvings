import { Service, MailService, ApiClient } from 'smtp2go-nodejs';
import { organizerEmail, smtpSenderEmail } from 'frontend/src/constants';

// Initialize SMTP2GO with API key
const smtp2go = {
  service: function (endpoint: string) {
    return new Service(endpoint);
  },
  mail: function () {
    return new MailService();
  },
  client: function () {
    return new ApiClient(process.env.SMTP2GO_API_KEY || '');
  },
};

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

// Function to send auto-response email to the user
const sendAutoResponse = async (name: string, email: string, subject: string) => {
  try {
    console.log(`Sending auto-response email to ${email}`);

    // Prepare auto-response email content
    const autoResponseContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #3E3C3B;">
        <h2 style="color: #6B4F41;">Thank You for Contacting Yelm Country Carvings</h2>
        <p>Hello ${name},</p>
        <p>Thank you for reaching out to us. We have received your message regarding "${subject}" and will get back to you as soon as possible.</p>
        <p>Our typical response time is within 1-2 business days.</p>
        <p>If you have any urgent matters, please feel free to call us at (253) 278-9814.</p>
        <p>Warm regards,</p>
        <p><strong>Yelm Country Carvings Team</strong></p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p>This is an automated response. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    // Create and send the auto-response email
    const autoResponseMail = smtp2go
      .mail()
      .from({
        name: 'Yelm Country Carvings',
        email: smtpSenderEmail,
      })
      .to({
        name: name,
        email: email,
      })
      .subject('Thank You for Contacting Yelm Country Carvings')
      .html(autoResponseContent);

    await smtp2go.client().consume(autoResponseMail);
    console.log('Auto-response email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending auto-response email:', error);
    return false;
  }
};

export const handleContactForm = async (req: Request) => {
  try {
    // Parse form data
    const formData = await req.formData();
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const phone = formData.get('phone')?.toString() || 'Not provided';
    const subject = formData.get('subject')?.toString() || 'General Inquiry';
    const message = formData.get('message')?.toString() || '';

    // Get subject label for display
    let subjectLabel = 'General Inquiry';
    switch (subject) {
      case 'custom':
        subjectLabel = 'Custom Order';
        break;
      case 'visit':
        subjectLabel = 'Schedule a Visit';
        break;
      case 'feedback':
        subjectLabel = 'Feedback';
        break;
      case 'other':
        subjectLabel = 'Other';
        break;
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return Response.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Prepare email content with enhanced formatting
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #3E3C3B;">
        <h2 style="color: #6B4F41;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Subject:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${subjectLabel}</td>
          </tr>
        </table>
        <h3 style="color: #6B4F41;">Message:</h3>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          ${message.replace(/\n/g, '<br>')}
        </div>
      </div>
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
      .subject(`Contact Form: ${subjectLabel} from ${name}`)
      .html(emailContent);

    // Handle multiple file attachments
    const fileKeys = Array.from(formData.keys()).filter(key => key.startsWith('file'));

    if (fileKeys.length > 0) {
      for (const key of fileKeys) {
        const file = formData.get(key) as File | null;

        if (file && file instanceof File && file.size > 0) {
          try {
            const filename = file.name;
            const mimetype = file.type;
            const arrayBuffer = await file.arrayBuffer();
            // Convert ArrayBuffer to base64 string
            const fileblob = Buffer.from(arrayBuffer).toString('base64');
            // Add attachment to the mail service
            mailService.attach(new SimpleAttachment(filename, fileblob, mimetype));
            console.log(`Attached file: ${filename}`);
          } catch (attachError) {
            console.error(`Error processing attachment ${key}:`, attachError);
          }
        }
      }
    }

    try {
      console.log('Attempting to send email...');

      // Send the email using the SMTP2GO client
      const result = await smtp2go.client().consume(mailService);

      // Log the result for debugging
      console.log('Email sent successfully. SMTP2GO response:', JSON.stringify(result));

      // Send auto-response email to the user
      let autoResponseSent = false;
      try {
        autoResponseSent = await sendAutoResponse(name, email, subjectLabel);
      } catch (autoResponseError) {
        console.error('Error in auto-response:', autoResponseError);
        // Don't fail the whole process if auto-response fails
      }

      return Response.json({
        success: true,
        message: 'Your message has been sent successfully!',
        autoResponseSent,
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
