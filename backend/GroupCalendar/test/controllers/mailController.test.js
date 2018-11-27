const Mailer = require('nodemailer/lib/mailer');
const MailController = require('../../controllers/mailController');

/**
 * Mock List:
 *	NodeMailerMocks
 */
// jest.mock('nodemailer');
const transportErr = {
	sendMail: (data, callback) => {
		const err = new Error('some error');
		callback(err, null);
	},
	close: () => {
	}
}
const transport = {
	sendMail: (data, callback) => {
		callback(null, null);
	},
	close: () => {
	}
}


/**
 * Test List:
 *
 * sendEmail
 */

 describe('Testing sendEmail', () => {

 	var getInfoSpy = jest.spyOn(MailController, 'sendEmail');

 	describe('Testing by without err', () => {
 		var receiver = "yueruc@gmail.com";
 		var subject = "Test";
 		var text = "Successful Test";
 		spyOn(Mailer.prototype, 'sendMail').and.callFake(function (mailOptions, cb) {
    return transport;
  });
 		MailController.sendEmail(receiver, subject, text, text);
 		expect(getInfoSpy).toHaveBeenCalled();
 	})

 	describe('Testing by with err', () => {
 		var receiver = "123";
 		var subject = "Test";
 		var text = "Failure Test";
 		spyOn(Mailer.prototype, 'sendMail').and.callFake(function (mailOptions, cb) {
    return transportErr;
  });
 		// Mailer.createTransport = jest.fn().mockImplementationOnce(() => {return transportErr});
 		MailController.sendEmail(receiver, subject, text, text);
 		expect(getInfoSpy).toHaveBeenCalled();
 	})
 })

