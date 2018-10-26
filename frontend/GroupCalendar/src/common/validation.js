
//this constraint is used for all validations
export const constraint = {
	//check this is a email
	email: {
		presence: true,
		email: {
			message: 'This is not a valid email address',
		},
	},
	//first or last name
	lastname: {
		presence: {
			message: 'Last name is required',
		}
	},
	firstname: {
		presence: {
			message: 'First name is required',
		}
	},
	//check user nmae
	username: {
		presence: true,
		length: {
			minimum: 6,
			maximum: 20,
			tooLong: 'Maximum length is 20',
			tooShort: 'Minimum length is 6',
		},
	},
	//check password
	password: {
		presence: true,
		length: {
			minimum: 8,
			maximum: 12,
			tooLong: 'Maximum legth is 12',
			tooShort: 'Minimum legth is 8',
		},
	},
}