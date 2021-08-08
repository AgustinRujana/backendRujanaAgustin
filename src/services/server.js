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

// Handlebars //
import handlebars from 'express-handlebars'
app.engine( 
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs"
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, 'views'));
////////////////

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
app.get('/', (req, res) => {
    res.send("Welcome to my project")
})
app.use('/api', mainRoutes)
//////////////

export default app