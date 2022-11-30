import { IResetPasswordParams } from '@user/interfaces/user.interface';
import ejs from 'ejs';
import fs from 'fs';

class ResetPasswordTemplate {
  public passwordResetConfirmationTemplate (templateParams: IResetPasswordParams): string {
    const { username, email, ipaddress, date } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf-8'), {
      username,
      email,
      ipaddress,
      date,
      image_url: '',
    });
  }
}

export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate();
