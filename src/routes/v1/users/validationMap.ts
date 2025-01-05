import { body, param, ValidationChain } from 'express-validator'
import { UserFields } from './interfaces'
import { validationHandler } from '@/src/middleware/validation-handler'

type UserValidationMaps = {
	[key in keyof UserFields]: ValidationChain
}

const NewUserValidationMaps: UserValidationMaps & {
	strongPassword: ValidationChain
} = {
	id: param('id')
		.notEmpty()
		.withMessage('Id is required')
		.isNumeric()
		.withMessage('Id must be a number'),
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
	password: body('password')
		.notEmpty()
		.withMessage('Password is required')
		.isString()
		.withMessage('Password must be a string'),
	strongPassword: body('password')
		.notEmpty()
		.withMessage('Password is required')
		.isStrongPassword({
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		})
		.withMessage('Password is not strong enough'),
}

const PatchUserValidationMap = [
	param('id')
		.notEmpty()
		.withMessage('Id is required')
		.isNumeric()
		.withMessage('Id must be a number'),
	body('email')
		.optional()
		.isEmail()
		.withMessage('Please enter a valid email')
		.normalizeEmail(),
	body('firstName')
		.optional()
		.isString()
		.withMessage('First Name must be a string'),
	body('lastName')
		.optional()
		.isString()
		.withMessage('Last Name must be a string'),
	validationHandler,
]

const UpdatePasswordValidationMap = {
	password: body('password')
		.notEmpty()
		.withMessage('Password is required')
		.isString()
		.withMessage('Password must be a string'),
	newPassword: body('newPassword')
		.notEmpty()
		.withMessage('New password is required')
		.isString()
		.withMessage('New password must be a string'),
	newPasswordConfirmation: body('newPasswordConfirmation')
		.notEmpty()
		.withMessage('New password confirmation is required')
		.isString()
		.withMessage('New password confirmation must be a string'),
}

export {
	NewUserValidationMaps,
	PatchUserValidationMap,
	UpdatePasswordValidationMap,
}
