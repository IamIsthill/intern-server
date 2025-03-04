const { toBool } = require('../utils')
require('dotenv').config()

const DEV = toBool(process.env.DEV)

module.exports = {
    ...require('./database.config'),
    DEV
}