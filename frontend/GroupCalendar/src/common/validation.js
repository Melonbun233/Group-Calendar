
//this constraint is used for all validations
export const signUpConstraints = {
	//check this is a email
	email: {
		presence: true,
		email: {
			message: 'Looks like an email address',
		},
	},
	firstname: {
		presence: true,
		length: {
			minimum: 1,
			maximum: 25,
			tooShort: 'At least something',
			tooLong: 'This is really too long',
		}
	},
	//first or last name
	lastname: {
		presence: true,
		length: {
			minimum: 1,
			maximum: 25,
			tooShort: 'At least something',
			tooLong: 'This is really too long',
		}
	},
	//check password
	password: {
		presence: true,
		length: {
			minimum: 6,
			maximum: 14,
			tooLong: 'maximum length is 14',
			tooShort: 'minimum length is 6',
		},
	},
};

export const changePwdConstraints = {
	userNewPwd: {
		presence: true,
		length: {
			minimum: 6,
			maximum: 14,
			tooLong: 'maximum length is 14',
			tooShort: 'minimum length is 6',
		},
	},
	userOldPwd: {
		presence: true,
		length: {
			minimum: 6,
			maximum: 14,
			tooLong: 'maximum length is 14',
			tooShort: 'minimum length is 6',
		},
	}
};

export const setGooglePwdConstraints = {
	pwd: {
		presence: true,
		length: {
			minimum: 6,
			maximum: 14,
			tooLong: 'maximum length is 14',
			tooShort: 'minimum length is 6',
		},
	},
};

export const createProjectConstraints = {
	projectName: {
		presence: true,
		length: {
			minimum: 1,
			maximum: 20,
			tooLong: 'maximum length is 20',
			tooShort: 'cannot be empty',
		},
	},
	projectDescription: {
		presence: true,
		length: {
			minimum: 1,
			maximum: 200,
			tooLong: 'maximum length is 200',
			tooShort: 'cannot be empty',
		},
	}
};