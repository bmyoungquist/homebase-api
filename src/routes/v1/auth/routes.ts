import { validationHandler } from '@/src/middleware/validation-handler'
import { Request, Response, Router } from 'express'
import { NewUserValidationMaps } from '../users/validationMap'
import { prisma } from '@/src/prisma-client'
import { UserFields } from '../users/interfaces'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = Router()

router.post(
	'/login',
	[
		NewUserValidationMaps.email,
		NewUserValidationMaps.password,
		validationHandler,
	],
	async (req: Request, res: Response) => {
		const { email, password } = req.body as UserFields
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (!user) {
			res.status(400).json('user not found')
			return
		}

		const passwordIsValid = bcrypt.compare(password, user.password)

		if (!passwordIsValid) {
			res.status(400).json('invalid password')
			return
		}

		const payload = {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			organizations: [],
		}

		const token = jwt.sign(payload, process.env.WEB_TOKEN_SECRET!, {
			expiresIn: '1w',
		})

		res.status(200).json({ token })
	}
)

export { router }
