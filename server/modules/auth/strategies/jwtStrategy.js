// server/modules/auth/strategies/jwtStrategy.js
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { UserService } from '../../users/usersService.js'

const userService = new UserService()

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['HS256']
}

export const configureJwtStrategy = (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
      try {
        const user = await userService.findById(jwtPayload.userId)
        
        if (!user) {
          return done(null, false)
        }

        // Remove sensitive data
        delete user.password
        
        return done(null, user)
      } catch (error) {
        return done(error, false)
      }
    })
  )
}
