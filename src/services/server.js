import express from 'express'
import mainRouter from '../routes/main.js'

const app = express()

app.use(express.json())
app.use('/api', mainRouter)

export default app