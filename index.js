const mongoose = require('mongoose')
import mongoose from 'mongoose'
import express from 'express'
import { connectDb } from './database'
import { Cors } from './middleware'

const app = express()
const port = 3000

connectDb()

app.use(Cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})


mongoose.connection.once('open', () => {
    console.log('Connected to database')
    app.listen(port, () => {
        console.log(`Intern System Server running on port ${port}`)
    })
})

mongoose.connection.on('error', err => {
    console.log(err)
})


module.exports = {
    app
}