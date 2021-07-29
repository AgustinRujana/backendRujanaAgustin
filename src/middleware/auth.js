import passport from 'passport'
import { Strategy as localStrategy } from 'passport-local'
import { Strategy as JWTStrategy } from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'
import { user as User } from '../model/user.js'

const strategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}

const strategyJWT = {
    secretOrKey: 'Why do this exist?',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

const signup = async (req, email, password, done) => {
    try {
        process.nextTick( () => {
            User.findOne({ email: email }, function (err, user) {
              if (err) {
                return done(err); 
              }
              if (user) {
                return done(null, false, {message: 'Email Taken'});
              }
              
              let data = req.body
  
              let newUser = new User()
              newUser.email = email
              newUser.password = newUser.generateHash(password)
              newUser.name = data.name
              newUser.phone = data.phone
              newUser.admin = data.admin
  
              newUser.save((err) => {
                if(err) { throw err }
                return done(null, newUser);
              })
            });
          })
    } catch (error) {
        done(error)
    }
}

const login = async (req, email, password, done) => {
    try {
        const user = await UserModel.findOne({ email });

        if(!user) {
            return done(null, false, { message: 'User not found' })
        }

        const validate = await user.isValidPassword(password)

        if(!validate) {
            return done(null, false, {message: 'Wrong Password'})
        }

        return done(null, user, {message: 'Logged in Succesfully'})
    } catch (error) {
        done(error)
    }
}

passport.use('signup', new localStrategy(strategyOptions, signup))
passport.use('login', new localStrategy(strategyOptions, login))

passport.use(
    new JWTStrategy(strategyJWT, async(token, done) => {
        try {
            return done(null, token.user) 
        } catch (error) {
            done(error)            
        }
    })
)

export default passport