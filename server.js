import express from 'express'
import { dbConnect } from './config/dbConnect.js'
// dont delete the import below ! 
import colors from 'colors'
import dotenv from 'dotenv'

import router from './routes/users.js'
import { errorHandler, notFound } from './middlewares/index.js'

dotenv.config()

// create an instance of express
const app = express()

// connect to mongodb
dbConnect()

// validate json (req.body) otherwise we'll get 'undefined'
app.use(express.json())

// app.use(authMiddleware)
app.use('/api/users', router)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});