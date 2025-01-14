import { Router, Request, Response } from 'express'
import { prisma } from '@/prisma-client'
import { validationMaps } from './validationMap'
import { PlaceFields } from './interfaces'

const router = Router()

router.post(
	'/',
	[
		validationMaps.name,
		validationMaps.address1,
		validationMaps.address2,
		validationMaps.city,
		validationMaps.country,
		validationMaps.description,
		validationMaps.state,
		validationMaps.zipCode,
		validationMaps.validationHandler,
	],
	async (req: Request, res: Response) => {
		const result = await prisma.place.create({
			data: {
				...(req.body as PlaceFields)
			},
		})

		res.status(201).json(result)
		return
	}
)

// router.put(
// 	'/:id',
// 	[...Object.values(validationMaps), validationHandler],
// 	async (req: Request, res: Response) => {
// 		const id = parseInt(req.params.id)
// 		const { parentId, name, description, isActive } =
// 			req.body as PlaceFields

// 		const result = await prisma.location.update({
// 			where: { id: id },
// 			data: {
// 				parentId: parentId ?? null,
// 				name: name,
// 				description: description ?? null,
// 				isActive: isActive,
// 			},
// 		})

// 		res.status(200).json(result)
// 	}
// )

// router.delete(
// 	'/:id',
// 	[validationMaps.id, validationHandler],
// 	async (req: Request, res: Response) => {
// 		const id = parseInt(req.params.id)

// 		const result = await prisma.location.delete({
// 			where: { id: id as number },
// 		})

// 		res.status(200).json(result)
// 	}
// )

router.get('/', async (req: Request, res: Response) => {
	const places = await prisma.place.findMany()

	res.status(200).json(places)
})

router.get('/:id', [validationMaps.id, validationMaps.validationHandler], async (req: Request, res: Response) => {
	const id = parseInt(req.params.id)
	const place = await prisma.place.findUnique({ where: { id } })

	if (!place) {
		res.sendStatus(404)
		return
	}

	res.status(200).json(place)
})

router.delete('/:id', [validationMaps.id, validationMaps.validationHandler], async (req: Request, res: Response) => {
	const id = parseInt(req.params.id)
	const result = await prisma.place.delete({ where: { id } })

	res.status(200).json(result)
})

export { router }
