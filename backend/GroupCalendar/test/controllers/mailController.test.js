const NodeMailerMocks = require('nodemailer');
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
	}
	close: () => {
	}
}
const transport = {
	sendMail: (data, callback) => {
		callback(null, null);
	}
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
 		NodeMailerMocks.createTransport = jest.fn().mockReturnValue(transport);
 		MailController.sendEmail(receiver, subject, text, text);
 		expect(getInfoSpy).toHaveBeenCalled();
 	})

 	describe('Testing by with err', () => {
 		var receiver = "123";
 		var subject = "Test";
 		var text = "Failure Test";
 		NodeMailerMocks.createTransport = jest.fn().mockReturnValue(transportErr);
 		MailController.sendEmail(receiver, subject, text, text);
 		expect(getInfoSpy).toHaveBeenCalled();
 	})
 })

