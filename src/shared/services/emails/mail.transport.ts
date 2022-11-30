import { BadRequestError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import sendGridMail from '@sendgrid/mail';
import Logger from 'bunyan';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface IMailOPtions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const log: Logger = config.createLogger('mailOptions');

sendGridMail.setApiKey(config.SENDGRID_API_KEY!);

class MailTransportService {

  public async sendEmail (recieverEmail: string, subject: string, body: string): Promise<void> {
    if (config.NODE_ENV === 'test' || config.NODE_ENV === 'development') {
      this.developmentEmailSender(recieverEmail, subject, body);
    } else {
      this.productionEmailSender(recieverEmail, subject, body);
    }
  }

  private async developmentEmailSender (recieverEmail: string, subject: string, body: string): Promise<void> {
    const transporter: Mail = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.SENDER_EMAIL, // generated ethereal user
        pass: config.SENDER_EMAIL_PASSWORD, // generated ethereal password
      },
    });
    const mailOptions: IMailOPtions = {
      from: `KM Social Net <${config.SENDER_EMAIL}>`,
      to: recieverEmail,
      subject,
      html: body,
    };
    try {
      await transporter.sendMail(mailOptions);
      log.info('Development email sent successfully.');
    } catch (error) {
      log.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }
  private async productionEmailSender (recieverEmail: string, subject: string, body: string): Promise<void> {
    const mailOptions: IMailOPtions = {
      from: `KM Social Net <${config.SENDER_EMAIL}>`,
      to: recieverEmail,
      subject,
      html: body,
    };
    try {
      await sendGridMail.send(mailOptions);
      log.info('Production email sent successfully.');
    } catch (error) {
      log.error('Error sending email', error);
      throw new BadRequestError('Error sending email');
    }
  }
}

export const mailTransport: MailTransportService = new MailTransportService();
