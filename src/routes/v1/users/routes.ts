import { Router, Request, Response } from 'express'
import { prisma } from '@/prisma-client'
import { UserFields } from './interfaces'
import {
	NewUserValidationMaps,
	PatchUserValidationMap,
	UpdatePasswordValidationMap,
} from './validationMap'
import { validationHandler } from '@/src/middleware/validation-handler'
import passport from 'passport'
import { getHashedPassword } from '@/src/util/password'

const router = Router()

router.post(
	'/',
	[
		NewUserValidationMaps.email,
		NewUserValidationMaps.firstName,
		NewUserValidationMaps.lastName,
		NewUserValidationMaps.strongPassword,
		validationHandler,
	],
	async (req: Request, res: Response) => {
		const { email, firstName, lastName, password } = req.body as UserFields

		const hashedPassword = await getHashedPassword(password)

		const newUser = await prisma.user.create({
			data: {
				email: email,
				firstName: firstName,
				lastName: lastName,
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
			createdAt: newUser.createdAt,
		})
	}
)

router.put(
	'/:id',
	[
		passport.authenticate('jwt', { session: false }),
		NewUserValidationMaps.id,
		NewUserValidationMaps.email,
		NewUserValidationMaps.firstName,
		NewUserValidationMaps.lastName,
		validationHandler,
	],
	async (req: Request, res: Response) => {
		const id = parseInt(req.params.id)
		const { email, firstName, lastName } = req.body as UserFields

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
			},
		})

		res.status(200).json({
			id,
			email,
			firstName,
			lastName,
		})
	}
)

router.patch(
	'/:id',
	PatchUserValidationMap,
	async (req: Request, res: Response) => {
		const id = parseInt(req.params.id)

		const user = await prisma.user.findUniqueOrThrow({
			where: { id },
			select: {
				email: true,
				firstName: true,
				lastName: true,
			},
		})

		const { email, firstName, lastName } = req.body

		user.email = email ?? user.email
		user.firstName = firstName ?? user.firstName
		user.lastName = lastName ?? user.lastName

		const result = await prisma.user.update({ where: { id }, data: user })

		res.status(200).json(result)
	}
)

router.patch(
	'/:id/password',
	UpdatePasswordValidationMap,
	async (req: Request, res: Response) => {
		const id = parseInt(req.params.id)
		const { password, newPassword, newPasswordConfirmation } = req.body
		const user = await prisma.user.findUniqueOrThrow({
			where: { id },
			select: { password: true },
		})
		const hashedPassword = await getHashedPassword(password)

		if (hashedPassword !== user.password) {
			res.status(400).json({ message: 'Incorrect Password' })
			return
		}

		const newPasswordHash = await getHashedPassword(newPassword)

		await prisma.user.update({
			where: { id },
			data: { password: newPasswordHash },
		})

		res.sendStatus(204)
	}
)

router.delete(
	'/:id',
	[NewUserValidationMaps.id, validationHandler],
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
		},
	})
	const status = users.length > 0 ? 200 : 204

	res.status(status).json(users)
})

export { router }
