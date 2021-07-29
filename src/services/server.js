import express from 'express'

import routesMain from '../routes/routes.js'

const app = express()

app.use(express.json())

app.use('/api', routesMain)

export default app