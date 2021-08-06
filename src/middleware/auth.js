import { Strategy as localStrategy } from 'passport-local'
import { Strategy as JWTStrategy } from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'
import { user as User } from '../model/user.model.js'

import config from '../../config.js'

const auth = (passport) => {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  const strategyOptions = {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
  }
  
  const strategyJWT = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.JWT_SECRET_KEY,
  }

  const signup = async (req, email, password, done) => {
      try {
          process.nextTick( () => {
            //Busca el usuario correspondiente
            User.findOne({ email: email }, function (err, user) {
              if (err) {
                return done(err); //Atrapa errores
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
              newUser.admin = data.admin || false
  
              newUser.save((err) => {
                if(err) { return done(err) }
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
          process.nextTick( () => {
              //Busca el usuario correspondiente
              User.findOne({ email: email }, function (err, user) {
                if (err) { return done(err) } //Atrapa errores
  
                if (!user) {
                  return done(null, false, {message: 'Incorrect Email'});
                }
  
                if (!user.validPassword(password)) {
                  return done(null, false, {message: 'Incorrect Password'});
                }
  
                return done(null, user); //Si paso todas las condiciones se loguea
              });
           });        
      } catch (error) {
          done(error)
      }
  }
  
  passport.use('signup', new localStrategy(strategyOptions, signup))
  passport.use('login', new localStrategy(strategyOptions, login))
  
  passport.use(
      new JWTStrategy(strategyJWT, async(token, done) => {
        try {
          console.log('El token es:' + token)
          const user = await User.findById(token.user._id)
          console.log('El user es:' + user)
          return done(null, user)          
        } catch (error) {
          return done(err);
        }
      })
  )
}

export default auth