import { body, param, ValidationChain } from 'express-validator'
import { validationHandler } from '@/src/middleware/validation-handler'

const validationMaps = {
	id: param('id')
		.notEmpty()
		.withMessage('id is required')
		.isNumeric()
		.withMessage('id must be numeric'),
	name: body('name').notEmpty().withMessage("name is required").isString().withMessage('name must be a string'),
	description: body('description').optional().isString().withMessage('description must be a string'),
	address1: body('address1').optional().isString().withMessage('address1 must be a string'),
	address2: body('address2').optional().isString().withMessage('address2 must be a string'),
	city: body('city').optional().isString().withMessage('city must be a string'),
	state: body('state').optional().isString().withMessage('state must be a string'),
	zipCode: body('zipCode').optional().isString().withMessage('zipCode must be a string'),
	country: body('country').optional().isString().withMessage('country must be a string'),
	validationHandler,
}

export { validationMaps }
