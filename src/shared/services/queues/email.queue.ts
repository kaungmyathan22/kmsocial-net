import { IEmailJob } from '@user/interfaces/user.interface';
import { emailWorker } from '@workders/email.worker';
import { BaseQueue } from './base.queue';

class EmailQueue extends BaseQueue {
  constructor() {
    super('email');
    this.processJob('forgotPasswordEmail', 5, emailWorker.addNotificatioNEmail);
  }
  public addEmailJob (name: string, data: IEmailJob): void {
    this.addJob(name, data);
  }
}

export const emailQueue: EmailQueue = new EmailQueue();
