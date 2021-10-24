import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import {
  MONGODB,
  PORT
} from './config.js'
import { AppointmentsRoutes, VaccinationCenterRoutes } from './routes/index.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.get('/', (req, res) => {
  res.send('this is the home page which is not using currently')
});

app.use('/vaccination_centers', VaccinationCenterRoutes)

app.use('/appointments', AppointmentsRoutes)

mongoose.connect(MONGODB, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`port is listening at http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.log(err.message)
  })
