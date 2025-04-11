export const setResponseHeaders = async (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'deny')
    res.setHeader('Content-Security-Policy', "default-src 'none'")
    res.removeHeader('X-Powered-By')
    next()
}