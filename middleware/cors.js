import cors from 'cors'
import { DEVELOPMENT } from '../config'

const corsOptions = {
    origin: [], // Change to whitelisted origin once na oks na
    optionsSuccessfulStatus: 200
}
if (DEVELOPMENT) {
    corsOptions.origin = '*' // Only for dev, use allow all
}

export const Cors = (options = corsOptions) => {
    console.log(options)
    return cors(options)
}
