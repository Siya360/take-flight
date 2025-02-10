// server/modules/auth/strategies/localStrategy.js
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { UserService } from '../../users/userService'

const userService = new UserService()

export const configureLocalStrategy = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await userService.findByEmail(email)
      if (!user || !await userService.validatePassword(password, user.password)) {
        return done(null, false, { message: 'Invalid credentials' })
      }
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.findById(id)
      done(null, user)
    } catch (error) {
      done(error)
    }
  })
}