const mongoose = require('mongoose')
const express = require('express')
const { connectDb } = require('./database')

const app = express()
const port = 3000

connectDb()

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