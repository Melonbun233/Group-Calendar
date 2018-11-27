const NodeMailerMocks = require('nodemailer');
const MailController = require('../../controllers/mailController');

/**
 * Mock List:
 *	NodeMailerMocks
 */
jest.mock('nodemailer');
NodeMailerMocks.createTransport.sendMail = jest.fn().mockImplementation(() =>{
	return Promise.resolve();
});
NodeMailerMocks.createTransport.close = jest.fn();


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
		MailController.sendEmail(receiver, subject, text, text);
		expect(getInfoSpy).toHaveBeenCalled();
	})

	describe('Testing by with err', () => {
		var receiver = "123";
		var subject = "Test";
		var text = "Failure Test";
		MailController.sendEmail(receiver, subject, text, text);
		expect(getInfoSpy).toHaveBeenCalled();
	})
})

		