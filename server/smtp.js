Meteor.startup(function () {
  if (process.env.MAIL_URL) {
    process.env.MAIL_URL = process.env.MAIL_URL;
  }
});

Meteor.methods({
  sendEmail: function (to, cc, from, subject, replyTo, emailData, error) {
    console.log('about to send email...');
    this.unblock();

    if (error) {
      console.log('Error: ' + error.reason);
    }

    if (!process.env.MAIL_URL) {
      throw new Meteor.Error('mail-url-missing', 'MAIL_URL is not configured on the server.');
    }

    SSR.compileTemplate('htmlEmail', Assets.getText('html-email.html'));

    Email.send({
      to: to,
      cc: cc,
      from: from,
      subject: subject,
      replyTo: replyTo,
      html: SSR.render('htmlEmail', emailData),
      attachements: [{}],
    });
  }
});
/*Meteor.startup(function () {
try {
  var result = AppWorkshop.sendSMS('+237699103611', "G'day MO' P !!");
  console.log("result:");
  console.log(result);
} catch (error) {
  console.log("error:");
  console.log(error);
}
});
Meteor.methods({
  sendSMSFromServer: function (recipient) {
    var result = AppWorkshop.sendSMS(recipient, "Test SMS!");
    return result;
  }
});*/
