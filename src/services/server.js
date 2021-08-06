import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import auth from '../middleware/auth.js'
import mainRoutes from '../routes/main.routes.js'


import config from '../../config.js'

//Setting enviroment
const database = config.DATABASE_URL

const app = express()

//  Cookie & Body Parser //
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, '/public')))
////////////////////

//  Session, Passport & Flash//
auth(passport)

app.use(session({
    secret: 'NeverUnderstoodWhyThisExist',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: database,
        ttl: 24 * 60 * 60 //Session persist for the day
      })
}))

app.use(passport.initialize())
app.use(passport.session())
///////////////

//  Routes  //
app.use('/api', mainRoutes)
//////////////

export default app