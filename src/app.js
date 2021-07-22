import dotenv, { config } from 'dotenv'

//Setting enviroment
dotenv.config()
const port = config.PORT
const database = config.DATABASE_URL

import connectToDatabase from './services/db.js'
import app from './services/server.js'

connectToDatabase(database).then(
    app.listen(port, () => {
        console.log(`Server started on port ${port}`)
    })
)