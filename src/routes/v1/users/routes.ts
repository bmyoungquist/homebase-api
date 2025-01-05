import { Router, Request, Response } from 'express'
import { prisma } from '@/prisma-client'
import { UserFields } from './interfaces'
import { validationResult } from 'express-validator'
import { validationMaps } from './validationMap'
import bcrypt from 'bcryptjs'
import { validationHandler } from '@/src/middleware/validation-handler'
import passport, { session } from 'passport'

const router = Router()

router.post(
	'/',
	[
		validationMaps.email,
		validationMaps.firstName,
		validationMaps.lastName,
		validationMaps.isActive,
		validationMaps.strongPassword,
		validationHandler,
	],
	async (req: Request, res: Response) => {
		const { email, firstName, lastName, isActive, password } =
			req.body as UserFields

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		const newUser = await prisma.user.create({
			data: {
				email: email,
				firstName: firstName,
				lastName: lastName,
				isActive: isActive,
				password: hashedPassword,
			},
		})

		if (!newUser) {
			throw new Error('failed to create user')
		}

		res.status(201).json({
			id: newUser.id,
			email: newUser.email,
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			isActive: newUser.isActive,
			createdAt: newUser.createdAt,
		})
	}
)

router.put(
	'/:id',
	[
		passport.authenticate('jwt', { session: false }),
		validationMaps.id,
		validationMaps.email,
		validationMaps.firstName,
		validationMaps.lastName,
		validationMaps.isActive,
		validationHandler,
	],
	async (req: Request, res: Response) => {
		const id = parseInt(req.params.id)
		const { email, firstName, lastName, isActive } = req.body as UserFields

		const user = await prisma.user.findFirst({ where: { id: id } })
		if (!user) {
			res.status(404).json(`user with id of "${id}" not found`)
			return
		}

		const result = await prisma.user.update({
			where: { id: id },
			data: {
				email: email,
				firstName: firstName,
				lastName: lastName ?? null,
				isActive: isActive,
			},
		})

		res.status(200).json({
			id,
			email,
			firstName,
			lastName,
			isActive,
		})
	}
)

router.delete(
	'/:id',
	[validationMaps.id, validationHandler],
	async (req: Request, res: Response) => {
		const id = parseInt(req.params.id)

		const result = await prisma.user.delete({ where: { id: id } })

		res.status(200).json(result)
	}
)

router.get('/', async (req: Request, res: Response) => {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			email: true,
			firstName: true,
			lastName: true,
			isActive: true,
		},
	})
	const status = users.length > 0 ? 200 : 204

	res.status(status).json(users)
})

export { router }
