const cors = require('cors')
const { DEV } = require('../config')

const corsOptions = {
    origin: [], // Change to whitelisted origin once na oks na
    optionsSuccessfulStatus: 200
}
if (DEV) {
    corsOptions.origin = '*' // Only for dev, use allow all
}

const Cors = (options = corsOptions) => {
    return cors(options)
}

module.exports = {
    Cors
}
