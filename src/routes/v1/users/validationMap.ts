import { body, param, ValidationChain } from 'express-validator'
import { UserFields } from './interfaces'

type UserValidationMaps = {
	[key in keyof UserFields]: ValidationChain
}

const validationMaps: UserValidationMaps & {
	strongPassword: ValidationChain
} = {
	id: param('id').notEmpty().isNumeric(),
	email: body('email')
		.notEmpty()
		.withMessage('email is required')
		.isEmail()
		.withMessage('email must be in a valid format')
		.normalizeEmail(),
	firstName: body('firstName')
		.notEmpty()
		.withMessage('firstName is required')
		.isString()
		.withMessage('firstName must be a string'),
	lastName: body('lastName')
		.isString()
		.withMessage('lastName must be a string'),
	isActive: body('isActive')
		.notEmpty()
		.withMessage('isActive is required')
		.isBoolean()
		.withMessage('isActive must be a boolean'),
	password: body('password').notEmpty().withMessage('password is required'),
	strongPassword: body('password')
		.notEmpty()
		.withMessage('password is required')
		.isStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		})
		.withMessage('password is not strong enough'),
}

export { validationMaps }
