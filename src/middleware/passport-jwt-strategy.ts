import passport from 'passport'
import {
	Strategy as JwtStrategy,
	ExtractJwt,
	StrategyOptionsWithoutRequest,
} from 'passport-jwt'
import { prisma } from '../prisma-client'

const opts: StrategyOptionsWithoutRequest = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.WEB_TOKEN_SECRET!,
}

export const useJwt = passport.use(
	'jwt',
	new JwtStrategy(opts, async (payload, done) => {
		const user = await prisma.user.findUnique({
			where: { id: payload.id },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
			},
		})

		if (user) return done(null, user)

		return done(null, false)
	})
)
