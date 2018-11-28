const Mailer = require('nodemailer');
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
		return 0;
	}
}
const transport = {
	sendMail: (data, callback) => {
		callback(null, null);
	},
	close: () => {
		return 0;
	}
}


/**
 * Test List:
 *
 * sendEmail
 */

 describe('Testing sendEmail', () => {

 	var getInfoSpy = jest.spyOn(MailController, 'sendEmail');

 	test('Testing by without err', () => {
 		beforeEach(() =>{ 
 			spyOn(Mailer, 'createTransport').and.callFake(() => {
 				return transport;
 			});
 			// Mailer.createTransport = jest.fn().mockReturnValueOnce(transport);
 		})
 		var receiver = "yueruc@gmail.com";
 		var subject = "Test";
 		var text = "Successful Test";
 		MailController.sendEmail(receiver, subject, text, text);
 		expect(getInfoSpy).toHaveBeenCalled();
 	})

 	
 	test('Testing by with err', () => {
 		
 		beforeEach(() =>{ 
 			spyOn(Mailer, 'createTransport').and.callFake(() => {
 				return transportErr;
 			});
 		})

 		var receiver = "123";
 		var subject = "Test";
 		var text = "Failure Test";
 		
 		// Mailer.createTransport = jest.fn().mockImplementationOnce(() => {return transportErr});
 		MailController.sendEmail(receiver, subject, text, text);
 		expect(getInfoSpy).toHaveBeenCalled();
 	})
 })

