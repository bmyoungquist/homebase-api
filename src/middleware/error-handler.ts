import { NextFunction, Request, Response } from "express"
import { getErrorMessage } from "@/util/get-error-message"


export function errorHandler(
	error: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (res.headersSent) {
		next(error)
		return
	}

	const message = getErrorMessage(error)

	console.log(message)

	res.status(500).json({
		error: {
			message: message
		}
	})
}