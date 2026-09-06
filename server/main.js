import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import 'imports/api/jobs/methods';
import 'imports/api/jobs/server/publications';

// In dev (no MAIL_URL set), Meteor prints emails to the server console instead of sending them.
Accounts.emailTemplates.siteName = 'Job Tracker';
Accounts.emailTemplates.from = 'Job Tracker <no-reply@jobtracker.com>';

Accounts.emailTemplates.resetPassword = {
  subject() {
    return 'Reset your Job Tracker password';
  },
  text(user, url) {
    // Meteor's default reset URL points at #/reset-password/TOKEN; rewrite it for our own route.
    const resetUrl = url.replace('#/', '');
    return `Hello,\n\nTo reset your password, click the link below:\n\n${resetUrl}\n\nIf you didn't request this, you can safely ignore this email.`;
  },
};

Meteor.startup(async () => {

  // Set the MAIL_URL for sending emails
  // eslint-disable-next-line no-undef
  process.env.MAIL_URL = 'smtp://b82587001%40smtp-brevo.com:bskbcIr0RNlanCK@://brevo.com'

  console.log('Server started'); // eslint-disable-line no-console
});
