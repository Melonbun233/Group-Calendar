
//this constraint is used for all validations
export const constraint = {
	//check this is a email
	email: {
		presence: true,
		email: {
			message: 'invalid email address',
		},
	},
	firstname: {
		presence: {
			allowEmpty: false,
		},
	},
	//first or last name
	lastname: {
		presence: {
			allowEmpty: false,
		},
	},
	//check user name
	username: {
		presence: true,
		length: {
			minimum: 6,
			maximum: 20,
			tooLong: 'maximum length is 20',
			tooShort: 'minimum length is 6',
		},
	},
	//check password
	password: {
		presence: true,
		length: {
			minimum: 8,
			maximum: 12,
			tooLong: 'maximum legth is 12',
			tooShort: 'minimum legth is 8',
		},
	},
}