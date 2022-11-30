import ejs from 'ejs';
import fs from 'fs';

class ForgotPasswordTemplate {
  public passwordResetTemplate (username: string, resetLink: string): string {
    return ejs.render(fs.readFileSync(__dirname + '/forgot-password-template.ejs', 'utf-8'), {
      username,
      resetLink,
      image_url: '',
    });
  }
}

export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate();
