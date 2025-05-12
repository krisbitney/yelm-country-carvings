import SMTP2GOApi from "smtp2go-nodejs";
import {organizerEmail, smtpSenderEmail} from "frontend/src/constants";

const smtp2go = SMTP2GOApi(process.env.SMTP2GO_API_KEY || '');

class SimpleAttachment {
  filename: string;
  fileblob: string;
  mimetype: string;
  constructor(filename: string, fileblob: string, mimetype: string) {
    this.filename = filename;
    this.fileblob = fileblob;
    this.mimetype = mimetype;
  }
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
      return Response.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
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
    const mailService = smtp2go.mail()
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
        mailService.attach(new SimpleAttachment(
          filename,
          fileblob,
          mimetype,
        ));
      } catch (attachError) {
        console.error('Error processing attachment:', attachError);
      }
    }

    await smtp2go.client().consume(mailService);

    return Response.json({
      success: true,
      message: 'Your message has been sent successfully!'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json(
      { success: false, message: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
};