import dotenv from 'dotenv'
import express from 'express'
import CompositionRoot from './CompositionRoot'

dotenv.config()
CompositionRoot.configure()

const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/auth', CompositionRoot.authRouter())
app.use('/restaurants', CompositionRoot.restaurantRouter())

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
