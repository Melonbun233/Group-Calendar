var httpMocks = require('node-mocks-http');
const MailController = require('../controllers/mailController');

/**
 * Mock List:
 *
 */

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
		MailController(receiver, subject, text, text);
		expect(getInfoSpy).toHaveBeenCalled();
	}

	describe('Testing by with err', () => {
		var receiver = "123";
		var subject = "Test";
		var text = "Failure Test";
		MailController(receiver, subject, text, text);
		expect(getInfoSpy).toHaveBeenCalled();
	}
}

		