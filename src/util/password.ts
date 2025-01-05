import { hash, genSalt } from 'bcryptjs'

export async function getHashedPassword(password: string): Promise<string> {
	const salt = await genSalt(10)
	const hashedPassword = await hash(password, salt)

	return hashedPassword
}
